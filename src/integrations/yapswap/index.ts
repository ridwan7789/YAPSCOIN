import { ethers } from "ethers";
import { YAPS_CONFIG } from "@/lib/constants";
import { TokenInfo, fetchPancakeSwapTokens, getTokenByAddress } from "@/utils/tokenList";

// Yapswap router address and constants
const YAPSWAP_ROUTER_ADDRESS = YAPS_CONFIG.YAPSWAP.ROUTER_ADDRESS; // Use the address from config
const WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"; // Wrapped BNB address on BSC

// Router ABI for Yapswap
const routerABI = [
  "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
  "function WETH() external view returns (address)"
];

// Full ERC20 ABI for complete token metadata
const erc20ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function approve(address spender, uint value) public returns (bool)"
];

export interface TokenMetadata {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  totalSupply: bigint;
  logoURI?: string;
  priceUSD?: number; // Optional price in USD
}

interface SwapEstimation {
  expectedOutput: bigint;
  priceImpact: number;
  lpFees: number;
  minimumReceived: bigint;
  route: string[];
  priceImpactDetails?: {
    priceImpact: number;
    liquidity: string;
    fees: string;
  };
}

interface PancakeSwapToken {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
}

interface PancakeSwapPair {
  id: string;
  token0: PancakeSwapToken;
  token1: PancakeSwapToken;
  reserve0: string;
  reserve1: string;
  totalSupply: string;
}

interface PancakeSwapQuoteResponse {
  data?: {
    pair?: {
      token0: PancakeSwapToken;
      token1: PancakeSwapToken;
      reserve0: string;
      reserve1: string;
    };
  };
}

/**
 * Yapswap Swap Integration
 * Handles token swaps on the Yapswap exchange
 */
export class Yapswap {
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;

  constructor() {
    // Initialize when a wallet is connected
  }

  /**
   * Initialize Yapswap with a provider and signer
   */
  async initialize(provider: ethers.Provider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  /**
   * Get the signer address
   */
  async getSignerAddress(): Promise<string> {
    if (!this.signer) {
      throw new Error("Wallet not connected");
    }
    return await this.signer.getAddress();
  }

  /**
   * Check if wallet is connected
   */
  isConnected(): boolean {
    return this.signer !== null;
  }

  /**
   * Approve a token for spending on Yapswap
   */
  async approveToken(tokenAddress: string, amount: number | bigint): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error("Wallet not connected");
    }

    const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, this.signer);
    const tokenInDecimals = await this.getTokenDecimals(tokenAddress); // Use the safe function
    const parsedAmount = typeof amount === 'number' 
      ? ethers.parseUnits(amount.toString(), tokenInDecimals) 
      : amount;

    const tx = await tokenContract.approve(YAPSWAP_ROUTER_ADDRESS, parsedAmount);
    await tx.wait();
    return tx;
  }

  /**
   * Check if a token is approved for spending on Yapswap
   */
  async isTokenApproved(tokenAddress: string, amount: number | bigint): Promise<boolean> {
    if (!this.signer || !this.provider) {
      throw new Error("Wallet not connected");
    }

    const signerAddress = await this.signer.getAddress();
    const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, this.provider);
    const allowance = await tokenContract.allowance(signerAddress, YAPSWAP_ROUTER_ADDRESS);
    
    const tokenInDecimals = await this.getTokenDecimals(tokenAddress); // Use the safe function
    const parsedAmount = typeof amount === 'number' 
      ? ethers.parseUnits(amount.toString(), tokenInDecimals) 
      : amount;

    return allowance >= parsedAmount;
  }

  /**
   * Get token balance for an address
   */
  async getTokenBalance(tokenAddress: string, address: string): Promise<bigint> {
    if (!this.provider) {
      throw new Error("Provider not initialized");
    }

    const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, this.provider);
    return await tokenContract.balanceOf(address);
  }

  /**
   * Get token decimals safely with fallback
   */
  async getTokenDecimals(tokenAddress: string): Promise<number> {
    if (!this.provider) {
      throw new Error("Provider not initialized");
    }

    if (tokenAddress.toLowerCase() === ethers.ZeroAddress.toLowerCase()) {
      // For native token (BNB), return 18 decimals
      return 18;
    }

    const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, this.provider);

    try {
      const decimals = await tokenContract.decimals();
      return Number(decimals);
    } catch (error) {
      console.error(`Error getting decimals for token ${tokenAddress}:`, error);
      // Default to 18 decimals if the token doesn't implement the decimals function properly
      return 18;
    }
  }

  /**
   * Get token name safely with fallback
   */
  async getTokenName(tokenAddress: string): Promise<string> {
    if (!this.provider) {
      throw new Error("Provider not initialized");
    }

    if (tokenAddress.toLowerCase() === ethers.ZeroAddress.toLowerCase()) {
      // For native token (BNB), return BNB
      return "BNB";
    }

    const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, this.provider);

    try {
      const name = await tokenContract.name();
      return name;
    } catch (error) {
      console.error(`Error getting name for token ${tokenAddress}:`, error);
      return "Unknown Token";
    }
  }

  /**
   * Get token symbol safely with fallback
   */
  async getTokenSymbol(tokenAddress: string): Promise<string> {
    if (!this.provider) {
      throw new Error("Provider not initialized");
    }

    if (tokenAddress.toLowerCase() === ethers.ZeroAddress.toLowerCase()) {
      // For native token (BNB), return BNB
      return "BNB";
    }

    const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, this.provider);

    try {
      const symbol = await tokenContract.symbol();
      return symbol;
    } catch (error) {
      console.error(`Error getting symbol for token ${tokenAddress}:`, error);
      return "UNKNOWN";
    }
  }

  /**
   * Get token price in USD from external API
   */
  async getTokenPriceUSD(tokenAddress: string): Promise<number> {
    try {
      // Try to get price from PancakeSwap API first
      const priceFromPancake = await this.getPriceFromPancakeSwap(tokenAddress);
      if (priceFromPancake && priceFromPancake > 0) {
        return priceFromPancake;
      }
      
      // First try to get price from a price API
      // This is a simple solution using CoinGecko for some common tokens
      const commonTokens: Record<string, string> = {
        "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c": "binancecoin", // WBNB
        "0xe9e7cea3dedca5984780bafc599bd69add087d56": "binance-usd", // BUSD
        "0x55d398326f99059ff775485246999027b3197955": "tether", // USDT
        [YAPS_CONFIG.TOKEN_ADDRESS.toLowerCase()]: "yaps-coin" // YAPS (if available)
      };

      const tokenId = commonTokens[tokenAddress.toLowerCase()];
      if (tokenId) {
        const response = await fetch(`${YAPS_CONFIG.API.COINGECKO.API_URL}/simple/price?ids=${tokenId}&vs_currencies=usd`);
        const data = await response.json();
        if (data[tokenId] && data[tokenId].usd) {
          return data[tokenId].usd;
        }
      }
      
      // If not a common token, return 0.00
      return 0.00;
    } catch (error) {
      console.error("Error fetching token price:", error);
      return 0.00; // Default to 0 if price fetch fails
    }
  }

  /**
   * Get token price from PancakeSwap API
   */
  async getPriceFromPancakeSwap(tokenAddress: string): Promise<number> {
    try {
      // Try to get price from PancakeSwap subgraph
      // For this to work, we would need to query the PancakeSwap subgraph
      // This is a placeholder since the GraphQL endpoint requires specific queries
      
      // For WBNB, BUSD, USDT we can provide approximate prices
      const knownTokenPrices: Record<string, number> = {
        "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c": 300, // WBNB
        "0xe9e7cea3dedca5984780bafc599bd69add087d56": 1, // BUSD
        "0x55d398326f99059ff775485246999027b3197955": 1 // USDT
      };
      
      const lowerAddress = tokenAddress.toLowerCase();
      if (knownTokenPrices[lowerAddress]) {
        return knownTokenPrices[lowerAddress];
      }
      
      return 0.00;
    } catch (error) {
      console.error("Error fetching price from PancakeSwap:", error);
      return 0.00;
    }
  }

  /**
   * Get complete token metadata from blockchain using NodeReal API
   */
  async getTokenMetadata(tokenAddress: string): Promise<TokenMetadata> {
    if (!this.provider) {
      throw new Error("Provider not initialized");
    }

    try {
      // First try to get the token from PancakeSwap API
      const tokenFromAPI = await getTokenByAddress(tokenAddress);
      
      if (tokenFromAPI) {
        // Get additional data from blockchain
        const [name, symbol, decimals, totalSupply, priceUSD] = await Promise.all([
          tokenFromAPI.name || this.getTokenName(tokenAddress),
          tokenFromAPI.symbol || this.getTokenSymbol(tokenAddress),
          tokenFromAPI.decimals || this.getTokenDecimals(tokenAddress),
          this.getTokenTotalSupply(tokenAddress),
          this.getTokenPriceUSD(tokenAddress).catch(() => 0.00)
        ]);

        return {
          name: name,
          symbol: symbol,
          address: tokenAddress,
          decimals: typeof tokenFromAPI.decimals === 'number' ? tokenFromAPI.decimals : decimals,
          totalSupply,
          logoURI: tokenFromAPI.logoURI,
          priceUSD
        };
      }
      
      // If not found in API, try getting data from the blockchain directly
      const [name, symbol, decimals, totalSupply, priceUSD] = await Promise.all([
        this.getTokenName(tokenAddress),
        this.getTokenSymbol(tokenAddress),
        this.getTokenDecimals(tokenAddress),
        this.getTokenTotalSupply(tokenAddress),
        this.getTokenPriceUSD(tokenAddress).catch(() => 0.00)
      ]);

      return {
        name,
        symbol,
        address: tokenAddress,
        decimals,
        totalSupply,
        priceUSD
      };
    } catch (error) {
      console.error(`Error fetching metadata for token ${tokenAddress}:`, error);
      
      // If main provider fails, try with NodeReal API as fallback
      try {
        const nodeRealProvider = new ethers.JsonRpcProvider(YAPS_CONFIG.API.NODE_REAL.RPC_URL);
        const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, nodeRealProvider);

        const [name, symbol, decimals, totalSupply, priceUSD] = await Promise.allSettled([
          tokenContract.name(),
          tokenContract.symbol(),
          tokenContract.decimals(),
          tokenContract.totalSupply(),
          this.getTokenPriceUSD(tokenAddress)
        ]);

        return {
          name: name.status === 'fulfilled' ? name.value : "Unknown Token",
          symbol: symbol.status === 'fulfilled' ? symbol.value : "UNKNOWN",
          address: tokenAddress,
          decimals: decimals.status === 'fulfilled' ? Number(decimals.value) : 18,
          totalSupply: totalSupply.status === 'fulfilled' ? totalSupply.value : 0n,
          priceUSD: priceUSD.status === 'fulfilled' ? priceUSD.value : 0.00
        };
      } catch (fallbackError) {
        console.error(`Fallback error fetching metadata for token ${tokenAddress}:`, fallbackError);
        
        // Final fallback with defaults
        return {
          name: "Unknown Token",
          symbol: "UNKNOWN",
          address: tokenAddress,
          decimals: 18,
          totalSupply: 0n,
          priceUSD: 0.00
        };
      }
    }
  }

  /**
   * Get token total supply safely with fallback
   */
  async getTokenTotalSupply(tokenAddress: string): Promise<bigint> {
    if (!this.provider) {
      throw new Error("Provider not initialized");
    }

    const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, this.provider);

    try {
      const supply = await tokenContract.totalSupply();
      return supply;
    } catch (error) {
      console.error(`Error getting total supply for token ${tokenAddress}:`, error);
      // Default to 0 if error
      return 0n;
    }
  }

  /**
   * Calculate price impact for a swap using PancakeSwap data
   */
  async calculatePriceImpact(
    tokenIn: string,
    tokenOut: string,
    amountIn: number | bigint
  ): Promise<number> {
    try {
      // Get the amounts out from router 
      const router = new ethers.Contract(YAPSWAP_ROUTER_ADDRESS, routerABI, this.provider);
      
      // Get decimals for both tokens
      const tokenInDecimals = await this.getTokenDecimals(tokenIn);
      const tokenOutDecimals = await this.getTokenDecimals(tokenOut);
      
      // Convert amount to proper units
      const parsedAmountIn = typeof amountIn === 'number' 
        ? ethers.parseUnits(amountIn.toString(), tokenInDecimals) 
        : amountIn;
      
      // Ensure token addresses are valid before building path
      if (!tokenIn || tokenIn === ethers.ZeroAddress) {
        return 0; // Cannot calculate price impact for invalid token
      }
      if (!tokenOut || tokenOut === ethers.ZeroAddress) {
        return 0; // Cannot calculate price impact for invalid token
      }
      
      // Determine path - try direct first
      let path = [tokenIn, tokenOut];
      let amounts: bigint[];
      try {
        amounts = await router.getAmountsOut(parsedAmountIn, path);
      } catch {
        // Fallback via WBNB
        path = [tokenIn, WBNB, tokenOut];
        amounts = await router.getAmountsOut(parsedAmountIn, path);
      }
      
      // Calculate price impact based on reserves and swap amount
      const outputAmount = amounts[amounts.length - 1];
      const inputAmount = parsedAmountIn;
      
      // Calculate the price without the trade (ideal price)
      // Get a very small amount calculation for reference price (0.001 of smallest unit)
      const smallAmountIn = BigInt(1);
      let smallAmounts: bigint[];
      try {
        smallAmounts = await router.getAmountsOut(smallAmountIn, path);
      } catch {
        // Fallback via WBNB
        path = [tokenIn, WBNB, tokenOut];
        smallAmounts = await router.getAmountsOut(smallAmountIn, path);
      }
      
      const smallOutput = smallAmounts[smallAmounts.length - 1];
      
      // Calculate what the output would be without slippage at the small amount
      // Use the ratio from the small trade to determine the ideal price
      const idealOutput = (inputAmount * smallOutput) / smallAmountIn;
      
      // Calculate price impact as percentage
      // Price impact = ((ideal_output - actual_output) / ideal_output) * 100
      let priceImpact = 0;
      if (idealOutput > 0n) {
        const impact = Number(idealOutput - outputAmount) / Number(idealOutput);
        priceImpact = impact * 100;
      } else {
        // Fallback simple calculation
        // For a more accurate calculation, we would need pair reserves
        // This is an estimation based on the difference between input and output value
        priceImpact = 0;
      }
      
      // Ensure price impact is never negative
      return Math.max(0, priceImpact);
    } catch (error) {
      console.warn('Could not calculate price impact:', error);
      return 0; // Default to 0 if calculation fails
    }
  }

  /**
   * Get estimated swap details including price impact, LP fees, etc. with PancakeSwap integration
   */
  async getSwapEstimation(
    tokenIn: string,
    tokenOut: string,
    amountIn: number | bigint,
    slippageTolerance: number = 0.5
  ): Promise<SwapEstimation> {
    if (!this.provider) {
      throw new Error("Provider not initialized");
    }
    
    // Handle case where tokenIn or tokenOut is the native token (BNB)
    const effectiveTokenIn = tokenIn === ethers.ZeroAddress ? WBNB : tokenIn;
    const effectiveTokenOut = tokenOut === ethers.ZeroAddress ? WBNB : tokenOut;

    const router = new ethers.Contract(YAPSWAP_ROUTER_ADDRESS, routerABI, this.provider);
    
    // Get decimals for both tokens
    const tokenInDecimals = await this.getTokenDecimals(tokenIn);
    const tokenOutDecimals = await this.getTokenDecimals(tokenOut);
    
    // Convert amount to proper units
    const parsedAmountIn = typeof amountIn === 'number' 
      ? ethers.parseUnits(amountIn.toString(), tokenInDecimals) 
      : amountIn;
    
    // Determine path - try direct first
    let path = [effectiveTokenIn, effectiveTokenOut];
    let amounts: bigint[];
    
    // First try direct path
    try {
      amounts = await router.getAmountsOut(parsedAmountIn, path);
    } catch (directPathError) {
      console.warn('Direct path failed, trying via WBNB:', directPathError);
      try {
        // Fallback via WBNB
        if (effectiveTokenIn === WBNB && effectiveTokenOut === WBNB) {
          // Cannot swap WBNB to WBNB
          throw new Error('Cannot swap identical tokens');
        }
        
        // If one of the tokens is already WBNB, no need to go through WBNB again
        if (effectiveTokenIn === WBNB || effectiveTokenOut === WBNB) {
          // Try direct path again (in case the tokens have liquidity directly)
          path = [effectiveTokenIn, effectiveTokenOut];
          amounts = await router.getAmountsOut(parsedAmountIn, path);
        } else {
          // Need to go through WBNB
          path = [effectiveTokenIn, WBNB, effectiveTokenOut];
          amounts = await router.getAmountsOut(parsedAmountIn, path);
        }
      } catch (viaWbnbError) {
        console.error('Both direct and via-WBNB paths failed:', directPathError, viaWbnbError);
        // Return a default/empty estimation instead of throwing to avoid UI errors
        return {
          expectedOutput: 0n,
          priceImpact: 0,
          lpFees: 0.25,
          minimumReceived: 0n,
          route: path
        };
      }
    }
    
    const expectedOutput = amounts[amounts.length - 1];
    
    // Calculate minimum received based on slippage
    const amountOutMin = (expectedOutput * BigInt(Math.floor((1 - slippageTolerance / 100) * 10000))) / 10000n;
    
    // Calculate price impact (simplified)
    let priceImpact = 0;
    try {
      // In a real implementation, compare against oracle prices or a reference
      priceImpact = await this.calculatePriceImpact(tokenIn, tokenOut, amountIn);
    } catch (error) {
      console.warn('Could not calculate price impact:', error);
      priceImpact = 0; // Default to 0 if calculation fails
    }
    
    // LP fees are typically 0.25% on PancakeSwap
    const lpFees = 0.25; // 0.25% LP fee
    
    return {
      expectedOutput,
      priceImpact,
      lpFees,
      minimumReceived: amountOutMin,
      route: path
    };
  }

  /**
   * Get expected output amount for a swap
   */
  async getExpectedOutput(tokenIn: string, tokenOut: string, amountIn: number | bigint): Promise<bigint> {
    if (!this.provider) {
      throw new Error("Provider not initialized");
    }

    const router = new ethers.Contract(YAPSWAP_ROUTER_ADDRESS, routerABI, this.provider);
    
    // Handle native BNB as tokenIn
    const effectiveTokenIn = tokenIn === ethers.ZeroAddress ? WBNB : tokenIn;
    const effectiveTokenOut = tokenOut === ethers.ZeroAddress ? WBNB : tokenOut;
    
    // First try direct path
    let path = [effectiveTokenIn, effectiveTokenOut];
    try {
      const tokenInDecimals = await this.getTokenDecimals(tokenIn); // Use the safe function
      const parsedAmountIn = typeof amountIn === 'number' 
        ? ethers.parseUnits(amountIn.toString(), tokenInDecimals) 
        : amountIn;

      const amounts = await router.getAmountsOut(parsedAmountIn, path);
      return amounts[amounts.length - 1];
    } catch {
      // If direct path fails, try via WBNB
      path = [effectiveTokenIn, WBNB, effectiveTokenOut];
      const tokenInDecimals = await this.getTokenDecimals(tokenIn); // Use the safe function
      const parsedAmountIn = typeof amountIn === 'number' 
        ? ethers.parseUnits(amountIn.toString(), tokenInDecimals) 
        : amountIn;

      const amounts = await router.getAmountsOut(parsedAmountIn, path);
      return amounts[amounts.length - 1];
    }
  }

  /**
   * Perform a token swap on Yapswap
   */
  async swapTokens(
    tokenIn: string, 
    tokenOut: string, 
    amountIn: number | bigint,
    slippageTolerance: number = 0.5, // 0.5% default slippage
    deadlineMinutes: number = 20 // 20 minutes default deadline
  ): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error("Wallet not connected");
    }

    const router = new ethers.Contract(YAPSWAP_ROUTER_ADDRESS, routerABI, this.signer);

    const tokenInDecimals = await this.getTokenDecimals(tokenIn); // Use the safe function
    const parsedAmountIn = typeof amountIn === 'number' 
      ? ethers.parseUnits(amountIn.toString(), tokenInDecimals) 
      : amountIn;

    // First, ensure token is approved (skip for native BNB)
    if (tokenIn !== ethers.ZeroAddress) {
      try {
        const isApproved = await this.isTokenApproved(tokenIn, amountIn);
        if (!isApproved) {
          await this.approveToken(tokenIn, amountIn);
        }
      } catch (approvalError) {
        console.warn('Approval check failed, attempting to approve anyway:', approvalError);
        // Try to approve anyway
        await this.approveToken(tokenIn, amountIn);
      }
    }

    // Determine the path - try direct first, then via WBNB if needed
    // Use the effective addresses for path calculation
    const effectiveTokenIn = tokenIn === ethers.ZeroAddress ? WBNB : tokenIn;
    const effectiveTokenOut = tokenOut === ethers.ZeroAddress ? WBNB : tokenOut;
    
    let path = [effectiveTokenIn, effectiveTokenOut];
    let amounts: bigint[];
    
    try {
      // First try direct path
      amounts = await router.getAmountsOut(parsedAmountIn, path);
    } catch {
      console.warn('Direct swap path failed, trying via WBNB');
      // Fallback via WBNB if no direct pair
      if (effectiveTokenIn !== WBNB && effectiveTokenOut !== WBNB) {
        // Need to go through WBNB
        path = [effectiveTokenIn, WBNB, effectiveTokenOut];
        amounts = await router.getAmountsOut(parsedAmountIn, path);
      } else {
        // If one of them is WBNB, try direct again as fallback
        path = [effectiveTokenIn, effectiveTokenOut];
        amounts = await router.getAmountsOut(parsedAmountIn, path);
      }
    }

    const amountOutMin = (amounts[amounts.length - 1] * BigInt(Math.floor((10000 - (slippageTolerance * 100))))) / 10000n;
    const to = await this.signer.getAddress();
    const deadline = Math.floor(Date.now() / 1000) + (60 * deadlineMinutes); // Deadline in minutes

    // Perform the swap - if tokenIn is native BNB, use different function
    let tx: ethers.TransactionResponse;
    if (tokenIn === ethers.ZeroAddress) {
      // For BNB swaps, we don't need approval and we need to send value
      // On BSC, we use swapExactETHForTokens (even though it's BNB, the function name is ETH for compatibility)
      tx = await router.swapExactETHForTokens(
        amountOutMin,
        path,
        to,
        deadline,
        { value: parsedAmountIn }
      );
    } else {
      // For ERC20 token swaps
      tx = await router.swapExactTokensForTokens(
        parsedAmountIn,
        amountOutMin,
        path,
        to,
        deadline
      );
    }

    return tx;
  }
}

// Singleton instance
export const yapswap = new Yapswap();