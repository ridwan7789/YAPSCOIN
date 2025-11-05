import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/hooks/useWallet";
import { yapswap, TokenMetadata } from "@/integrations/yapswap";
import { YAPS_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, RotateCcw } from "lucide-react";
import TokenSearchModal from "./TokenSearchModal";
import { TokenInfo, COMMON_BSC_TOKENS } from "@/utils/tokenList";

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
}

// Update the initial supported tokens to include more common tokens
const INITIAL_SUPPORTED_TOKENS: TokenInfo[] = [
  {
    symbol: "BNB",
    name: "Binance Coin",
    address: ethers.ZeroAddress, // Native BNB
    decimals: 18
  },
  {
    symbol: "YAPS",
    name: "YAPS COIN",
    address: YAPS_CONFIG.TOKEN_ADDRESS, // Use actual YAPS token address from config
    decimals: 18
  },
  ...COMMON_BSC_TOKENS // Include common BSC tokens
];

const Swap = () => {
  const { 
    account, 
    balance, 
    isConnected, 
    connectWallet, 
    switchToBscNetwork,
    error 
  } = useWallet();
  
  const [tokenIn, setTokenIn] = useState<TokenInfo>(INITIAL_SUPPORTED_TOKENS[0]); // Default to BNB
  const [tokenOut, setTokenOut] = useState<TokenInfo>(INITIAL_SUPPORTED_TOKENS[1]); // Default to YAPS
  const [amountIn, setAmountIn] = useState<string>("");
  const [amountOut, setAmountOut] = useState<string>("");
  const [customSlippage, setCustomSlippage] = useState<string>("0.5");
  const [useCustomSlippage, setUseCustomSlippage] = useState<boolean>(false);
  const [transactionDeadline, setTransactionDeadline] = useState<string>("20"); // Default 20 minutes
  const [customTokenInAddress, setCustomTokenInAddress] = useState<string>("");
  const [customTokenOutAddress, setCustomTokenOutAddress] = useState<string>("");
  const [isUsingCustomTokenIn, setIsUsingCustomTokenIn] = useState<boolean>(false);
  const [isUsingCustomTokenOut, setIsUsingCustomTokenOut] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isSwitched, setIsSwitched] = useState<boolean>(false);
  const [swapEstimation, setSwapEstimation] = useState<any>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showTokenInModal, setShowTokenInModal] = useState<boolean>(false);
  const [showTokenOutModal, setShowTokenOutModal] = useState<boolean>(false);

  const slippage = useCustomSlippage ? parseFloat(customSlippage) : 0.5;
  const deadline = parseInt(transactionDeadline);

  // Calculate swap details when amountIn changes
  useEffect(() => {
    let isCancelled = false; // To prevent state updates on unmounted component

    const calculateSwapDetails = async () => {
      if (amountIn && parseFloat(amountIn) > 0 && yapswap.isConnected()) {
        try {
          if (!isCancelled) setIsApproving(true); // Show loading during calculation
          const actualTokenIn = isUsingCustomTokenIn ? customTokenInAddress : tokenIn.address;
          const actualTokenOut = isUsingCustomTokenOut ? customTokenOutAddress : tokenOut.address;
          
          // Validate token addresses
          if (actualTokenIn && !ethers.isAddress(actualTokenIn) && actualTokenIn !== ethers.ZeroAddress) {
            if (!isCancelled) {
              setAmountOut("");
              setSwapEstimation(null);
              // Check if it's the placeholder address
              if (actualTokenIn === "YOUR_YAPS_TOKEN_ADDRESS") {
                toast.error("YAPS token address not configured. Please update the token address in environment variables.");
              } else {
                toast.error("Invalid input token address");
              }
            }
            return;
          }
          
          if (actualTokenOut && !ethers.isAddress(actualTokenOut) && actualTokenOut !== ethers.ZeroAddress) {
            if (!isCancelled) {
              setAmountOut("");
              setSwapEstimation(null);
              // Check if it's the placeholder address
              if (actualTokenOut === "YOUR_YAPS_TOKEN_ADDRESS") {
                toast.error("YAPS token address not configured. Please update the token address in environment variables.");
              } else {
                toast.error("Invalid output token address");
              }
            }
            return;
          }
          
          // Check if swapping between same tokens
          if (actualTokenIn.toLowerCase() === actualTokenOut.toLowerCase()) {
            if (!isCancelled) {
              setAmountOut("");
              setSwapEstimation(null);
              toast.error("Cannot swap identical tokens");
            }
            return;
          }
          
          // More specific error handling for swap estimation
          try {
            const estimation = await yapswap.getSwapEstimation(
              actualTokenIn,
              actualTokenOut,
              parseFloat(amountIn),
              slippage
            );
            
            if (!isCancelled) {
              // Only update if there's a valid estimation (not all zeros)
              if (estimation.expectedOutput > 0n) {
                setSwapEstimation(estimation);
                
                // Convert to expected output token decimals using the Yapswap instance
                const outputDecimals = await yapswap.getTokenDecimals(actualTokenOut);
                const formattedOutput = ethers.formatUnits(estimation.expectedOutput, outputDecimals);
                setAmountOut(formattedOutput);
              } else {
                // If estimation returns 0, clear the output
                setAmountOut("");
                setSwapEstimation(null);
              }
            }
          } catch (estimationError: any) {
            console.error("Error calculating swap estimation:", estimationError);
            
            // Check if the error is due to unsupported token pair
            if (estimationError.message && estimationError.message.includes("Unable to find a valid swap path")) {
              if (!isCancelled) {
                setAmountOut("");
                setSwapEstimation(null);
                // Don't show an error toast for this as it's expected for some token pairs
              }
              return;
            }
            
            // Fallback: try the expected output calculation directly
            try {
              const expectedOutput = await yapswap.getExpectedOutput(
                actualTokenIn,
                actualTokenOut,
                parseFloat(amountIn)
              );
              
              if (!isCancelled && expectedOutput > 0n) {
                const outputDecimals = await yapswap.getTokenDecimals(actualTokenOut);
                const formattedOutput = ethers.formatUnits(expectedOutput, outputDecimals);
                setAmountOut(formattedOutput);
                
                // Create a basic estimation without price impact calculation
                const basicEstimation = {
                  expectedOutput,
                  priceImpact: 0,
                  lpFees: 0.25,
                  minimumReceived: expectedOutput,
                  route: [actualTokenIn, actualTokenOut]
                };
                setSwapEstimation(basicEstimation);
              } else {
                // If even fallback fails, clear the estimation
                setAmountOut("");
                setSwapEstimation(null);
              }
            } catch (fallbackError: any) {
              console.error("Fallback calculation also failed:", fallbackError);
              if (!isCancelled) {
                setAmountOut("");
                setSwapEstimation(null);
                
                // Provide more specific error messages
                if (fallbackError.message && fallbackError.message.includes("Invalid token address")) {
                  toast.error("Invalid token address detected");
                } else if (!fallbackError.message.includes("execution reverted")) {
                  // Only show toast for non-reverted errors
                  toast.error("Error calculating swap details. Please try again.");
                }
              }
            }
          }
        } catch (error: any) {
          console.error("General error calculating swap details:", error);
          if (!isCancelled) {
            setAmountOut("");
            setSwapEstimation(null);
            
            // Provide more specific error messages
            if (error.message && error.message.includes("Provider not initialized")) {
              toast.error("Wallet not connected properly. Please reconnect your wallet.");
            } else {
              toast.error("Error calculating swap details. Please try again.");
            }
          }
        } finally {
          if (!isCancelled) setIsApproving(false);
        }
      } else {
        if (!isCancelled) {
          setAmountOut("");
          setSwapEstimation(null);
        }
      }
    };

    calculateSwapDetails();

    // Cleanup function to set isCancelled to true when component unmounts
    return () => {
      isCancelled = true;
    };
  }, [amountIn, tokenIn, tokenOut, customTokenInAddress, customTokenOutAddress, isUsingCustomTokenIn, isUsingCustomTokenOut, isSwitched, slippage]); // Added isSwitched to dependencies

  const handleSwap = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!amountIn || parseFloat(amountIn) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (isUsingCustomTokenIn && !ethers.isAddress(customTokenInAddress) && customTokenInAddress !== ethers.ZeroAddress) {
      toast.error("Please enter a valid input token address");
      return;
    }

    if (isUsingCustomTokenOut && !ethers.isAddress(customTokenOutAddress) && customTokenOutAddress !== ethers.ZeroAddress) {
      toast.error("Please enter a valid output token address");
      return;
    }

    try {
      setIsSwapping(true);
      
      // Switch to BSC network if not already on it
      await switchToBscNetwork();
      
      // Prepare token addresses
      const actualTokenIn = isUsingCustomTokenIn ? customTokenInAddress : tokenIn.address;
      const actualTokenOut = isUsingCustomTokenOut ? customTokenOutAddress : tokenOut.address;

      // Perform the swap
      const tx = await yapswap.swapTokens(
        actualTokenIn,
        actualTokenOut,
        parseFloat(amountIn),
        slippage,
        deadline
      );

      toast.success("Swap initiated successfully!", {
        description: `Transaction hash: ${tx.hash}`
      });

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      if (receipt) {
        toast.success("Swap completed successfully!");
        setAmountIn("");
        setAmountOut("");
        setSwapEstimation(null);
      }
    } catch (error: any) {
      console.error("Swap error:", error);
      toast.error(error.message || "An error occurred during the swap");
    } finally {
      setIsSwapping(false);
    }
  };

  const switchTokens = () => {
    // Switch custom token settings
    const tempUseCustom = isUsingCustomTokenIn;
    setIsUsingCustomTokenIn(isUsingCustomTokenOut);
    setIsUsingCustomTokenOut(tempUseCustom);
    
    // Switch custom addresses
    const tempCustomAddress = customTokenInAddress;
    setCustomTokenInAddress(customTokenOutAddress);
    setCustomTokenOutAddress(tempCustomAddress);
    
    // Switch token selections
    const tempToken = tokenIn;
    setTokenIn(tokenOut);
    setTokenOut(tempToken);
    
    // Switch amounts
    const tempAmount = amountIn;
    setAmountIn(amountOut);
    setAmountOut(tempAmount);
    
    setIsSwitched(!isSwitched); // Trigger re-calculation
  };

  const handleMaxClick = () => {
    if (balance && !isUsingCustomTokenIn && tokenIn.symbol === "BNB") {
      // Use a small buffer for gas
      const maxAmount = parseFloat(balance) - 0.001 > 0 ? (parseFloat(balance) - 0.001).toString() : "0";
      setAmountIn(maxAmount);
    }
  };

  const handleCustomTokenInChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setCustomTokenInAddress(address);
    
    // Validate if it's a valid address
    if (ethers.isAddress(address) || address === ethers.ZeroAddress) {
      try {
        // Fetch token metadata automatically
        const tokenMetadata = await yapswap.getTokenMetadata(address);
        toast.success(`Token identified: ${tokenMetadata.name} (${tokenMetadata.symbol}), Decimals: ${tokenMetadata.decimals}`);
      } catch (error) {
        console.error("Error fetching token metadata:", error);
        toast.error("Could not fetch token metadata, using defaults");
      }
    } else if (address.length > 0) {
      toast.error("Invalid token address");
    }
  };

  const handleCustomTokenOutChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setCustomTokenOutAddress(address);
    
    // Validate if it's a valid address
    if (ethers.isAddress(address) || address === ethers.ZeroAddress) {
      try {
        // Fetch token metadata automatically
        const tokenMetadata = await yapswap.getTokenMetadata(address);
        toast.success(`Token identified: ${tokenMetadata.name} (${tokenMetadata.symbol}), Decimals: ${tokenMetadata.decimals}`);
      } catch (error) {
        console.error("Error fetching token metadata:", error);
        toast.error("Could not fetch token metadata, using defaults");
      }
    } else if (address.length > 0) {
      toast.error("Invalid token address");
    }
  };

  const handleSelectTokenIn = (token: TokenInfo) => {
    setTokenIn(token);
    setIsUsingCustomTokenIn(false);
    setCustomTokenInAddress("");
  };

  const handleSelectTokenOut = (token: TokenInfo) => {
    setTokenOut(token);
    setIsUsingCustomTokenOut(false);
    setCustomTokenOutAddress("");
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-center text-white">Yapswap Exchange</CardTitle>
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 border-0 bg-gray-700/50 hover:bg-gray-600/50">
                <Settings className="h-4 w-4 text-white" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-md">
              <DialogHeader>
                <DialogTitle>Transaction Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slippage">Slippage Tolerance</Label>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-2 flex-1">
                      <Button
                        variant={!useCustomSlippage && slippage === 0.1 ? "default" : "outline"}
                        onClick={() => { setUseCustomSlippage(false); setCustomSlippage("0.1"); setShowSettings(false); }}
                        className="flex-1"
                      >
                        0.1%
                      </Button>
                      <Button
                        variant={!useCustomSlippage && slippage === 0.25 ? "default" : "outline"}
                        onClick={() => { setUseCustomSlippage(false); setCustomSlippage("0.25"); setShowSettings(false); }}
                        className="flex-1"
                      >
                        0.25%
                      </Button>
                      <Button
                        variant={!useCustomSlippage && slippage === 0.5 ? "default" : "outline"}
                        onClick={() => { setUseCustomSlippage(false); setCustomSlippage("0.5"); setShowSettings(false); }}
                        className="flex-1"
                      >
                        0.5%
                      </Button>
                      <Button
                        variant={!useCustomSlippage && slippage === 1.0 ? "default" : "outline"}
                        onClick={() => { setUseCustomSlippage(false); setCustomSlippage("1.0"); setShowSettings(false); }}
                        className="flex-1"
                      >
                        1.0%
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="custom-slippage"
                        checked={useCustomSlippage}
                        onCheckedChange={setUseCustomSlippage}
                      />
                      <Label htmlFor="custom-slippage">Custom</Label>
                    </div>
                  </div>
                  
                  {useCustomSlippage && (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={customSlippage}
                        onChange={(e) => setCustomSlippage(e.target.value)}
                        min="0.1"
                        step="0.05"
                        max="50"
                        className="bg-gray-800/50 border-gray-700 text-white"
                        placeholder="Enter slippage"
                      />
                      <span>%</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deadline">Transaction Deadline</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={transactionDeadline}
                      onChange={(e) => setTransactionDeadline(e.target.value)}
                      min="1"
                      max="180"
                      className="bg-gray-800/50 border-gray-700 text-white"
                      placeholder="Minutes"
                    />
                    <span>minutes</span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connect Wallet Section */}
        {!isConnected ? (
          <div className="text-center">
            <Button 
              onClick={connectWallet} 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg"
            >
              Connect Wallet
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Token In Section */}
            <div className="space-y-2">
              <Label htmlFor="tokenIn" className="text-white">From</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Input
                      id="tokenIn"
                      type="number"
                      placeholder="0.0"
                      value={amountIn}
                      onChange={(e) => setAmountIn(e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white pr-24 py-6 text-lg"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMaxClick}
                        className="text-xs bg-gray-700/50 border-gray-600 text-white"
                      >
                        MAX
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Custom token toggle */}
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="custom-token-in"
                    checked={isUsingCustomTokenIn}
                    onCheckedChange={setIsUsingCustomTokenIn}
                  />
                  <Label htmlFor="custom-token-in" className="text-white">Use Custom Token</Label>
                </div>
                
                {/* Custom token input */}
                {isUsingCustomTokenIn ? (
                  <div className="space-y-2">
                    <Label htmlFor="customTokenInAddress" className="text-white">Input Token Address</Label>
                    <Input
                      id="customTokenInAddress"
                      type="text"
                      placeholder="0x..."
                      value={customTokenInAddress}
                      onChange={handleCustomTokenInChange}
                      className="bg-gray-800/50 border-gray-700 text-white py-2"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => setShowTokenInModal(true)}
                      variant="outline"
                      className="flex-1 bg-gray-700/50 border-gray-600 text-white h-12 justify-start"
                    >
                      <div className="flex items-center">
                        {tokenIn.logoURI ? (
                          <img 
                            src={tokenIn.logoURI} 
                            alt={tokenIn.symbol} 
                            className="w-6 h-6 rounded-full mr-2"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = `https://tokens.1inch.io/0x0000000000000000000000000000000000000000.png`;
                            }}
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center mr-2">
                            <span className="text-xs">{tokenIn.symbol.charAt(0)}</span>
                          </div>
                        )}
                        <span>{tokenIn.symbol}</span>
                      </div>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Switch Tokens Button */}
            <div className="flex justify-center -my-2">
              <Button
                variant="outline"
                size="icon"
                onClick={switchTokens}
                className="rounded-full border-gray-600 bg-gray-800/50 hover:bg-gray-700/50"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Token Out Section */}
            <div className="space-y-2">
              <Label htmlFor="tokenOut" className="text-white">To</Label>
              <div className="space-y-2">
                <div className="relative flex-1">
                  <Input
                    id="tokenOut"
                    type="number"
                    placeholder="0.0"
                    value={amountOut}
                    readOnly
                    className="bg-gray-800/50 border-gray-700 text-white py-6 text-lg"
                  />
                </div>
                
                {/* Custom token toggle */}
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="custom-token-out"
                    checked={isUsingCustomTokenOut}
                    onCheckedChange={setIsUsingCustomTokenOut}
                  />
                  <Label htmlFor="custom-token-out" className="text-white">Use Custom Token</Label>
                </div>
                
                {/* Custom token input */}
                {isUsingCustomTokenOut ? (
                  <div className="space-y-2">
                    <Label htmlFor="customTokenOutAddress" className="text-white">Output Token Address</Label>
                    <Input
                      id="customTokenOutAddress"
                      type="text"
                      placeholder="0x..."
                      value={customTokenOutAddress}
                      onChange={handleCustomTokenOutChange}
                      className="bg-gray-800/50 border-gray-700 text-white py-2"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 pt-2">
                    <Button
                      onClick={() => setShowTokenOutModal(true)}
                      variant="outline"
                      className="flex-1 bg-gray-700/50 border-gray-600 text-white h-12 justify-start"
                    >
                      <div className="flex items-center">
                        {tokenOut.logoURI ? (
                          <img 
                            src={tokenOut.logoURI} 
                            alt={tokenOut.symbol} 
                            className="w-6 h-6 rounded-full mr-2"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = `https://tokens.1inch.io/0x0000000000000000000000000000000000000000.png`;
                            }}
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center mr-2">
                            <span className="text-xs">{tokenOut.symbol.charAt(0)}</span>
                          </div>
                        )}
                        <span>{tokenOut.symbol}</span>
                      </div>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Swap details - PancakeSwap style */}
            {swapEstimation && (
              <div className="bg-gray-800/50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Price Impact</span>
                  <span className={`font-medium ${swapEstimation.priceImpact > 5 ? 'text-red-400' : swapEstimation.priceImpact > 2 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {swapEstimation.priceImpact.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Liquidity Provider Fee</span>
                  <span className="font-medium">{swapEstimation.lpFees}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Minimum Received</span>
                  <span className="font-medium">
                    {swapEstimation.minimumReceived ? 
                      ethers.formatUnits(swapEstimation.minimumReceived, 
                        isUsingCustomTokenOut 
                          ? (customTokenOutAddress === ethers.ZeroAddress ? 18 : 18) // Default to 18 decimals for custom tokens
                          : tokenOut.decimals) 
                      : "0"} 
                    {isUsingCustomTokenOut ? customTokenOutAddress.substring(0, 6) + "..." : tokenOut.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Route</span>
                  <span className="font-medium">
                    {swapEstimation?.route && Array.isArray(swapEstimation.route) 
                      ? swapEstimation.route.map((addr: string, i: number) => 
                          addr === ethers.ZeroAddress ? 'BNB' : 
                          addr === YAPS_CONFIG.TOKEN_ADDRESS ? 'YAPS' :
                          addr === '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56' ? 'BUSD' :
                          addr === '0x55d398326f99059fF775485246999027B3197955' ? 'USDT' :
                          addr.substring(0, 6) + '...' + addr.substring(addr.length - 4)
                        ).join(' → ')
                      : 'Direct'}
                  </span>
                </div>
              </div>
            )}

            {/* Swap Button */}
            <Button
              onClick={handleSwap}
              disabled={isSwapping || isApproving || !amountIn || parseFloat(amountIn) <= 0}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg"
            >
              {isSwapping ? "Swapping..." : isApproving ? "Calculating..." : "Swap"}
            </Button>

            {/* Wallet Info */}
            <div className="text-center text-sm text-gray-400">
              <p>Connected: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Not connected"}</p>
              <p>Balance: {balance ? `${parseFloat(balance).toFixed(4)} BNB` : "0 BNB"}</p>
            </div>
          </div>
        )}
        
        {/* Token Search Modals */}
        <TokenSearchModal
          open={showTokenInModal}
          onOpenChange={setShowTokenInModal}
          onSelectToken={handleSelectTokenIn}
          title="Select a token"
          subtitle="Search or select a token to swap from"
        />
        
        <TokenSearchModal
          open={showTokenOutModal}
          onOpenChange={setShowTokenOutModal}
          onSelectToken={handleSelectTokenOut}
          title="Select a token"
          subtitle="Search or select a token to swap to"
        />
      </CardContent>
    </Card>
  );
};

export default Swap;