import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { yapswap } from "@/integrations/yapswap";

interface WalletState {
  account: string | null;
  balance: string | null;
  provider: ethers.Provider | null;
  signer: ethers.Signer | null;
  chainId: number | null;
  isConnected: boolean;
  error: string | null;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    account: null,
    balance: null,
    provider: null,
    signer: null,
    chainId: null,
    isConnected: false,
    error: null,
  });

  // Check for existing wallet connection on component mount
  useEffect(() => {
    const connectExistingWallet = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          // Check if already connected
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (error) {
          console.error("Error checking existing wallet connection:", error);
        }
      }
    };

    connectExistingWallet();
  }, []);

  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const account = accounts[0];
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        
        // Initialize yapswap with provider and signer
        await yapswap.initialize(provider, signer);

        // Get account balance
        const balance = await provider.getBalance(account);
        const formattedBalance = ethers.formatEther(balance);

        setWalletState({
          account,
          balance: formattedBalance,
          provider,
          signer,
          chainId: Number(network.chainId),
          isConnected: true,
          error: null,
        });
      } else {
        throw new Error("Please install a wallet like MetaMask");
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      setWalletState(prev => ({
        ...prev,
        error: error.message || "Failed to connect wallet",
      }));
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      account: null,
      balance: null,
      provider: null,
      signer: null,
      chainId: null,
      isConnected: false,
      error: null,
    });
  };

  const switchToBscNetwork = async () => {
    if (!window.ethereum) {
      throw new Error("Please install a wallet like MetaMask");
    }

    try {
      // Try to switch to Binance Smart Chain Mainnet
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }], // BSC Mainnet chain ID in hex
      });
      return true;
    } catch (switchError: any) {
      // If user rejects the switch or the network hasn't been added
      if (switchError.code === 4902) {
        // Add BSC network if it doesn't exist
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x38",
                chainName: "Binance Smart Chain Mainnet",
                nativeCurrency: {
                  name: "BNB",
                  symbol: "BNB",
                  decimals: 18,
                },
                rpcUrls: ["https://bsc-dataseed.binance.org/"],
                blockExplorerUrls: ["https://bscscan.com"],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error("Error adding BSC network:", addError);
          throw addError;
        }
      }
      throw switchError;
    }
  };

  const updateBalance = async () => {
    if (walletState.account && walletState.provider) {
      try {
        const balance = await walletState.provider.getBalance(walletState.account);
        const formattedBalance = ethers.formatEther(balance);
        
        setWalletState(prev => ({
          ...prev,
          balance: formattedBalance,
        }));
      } catch (error) {
        console.error("Error updating balance:", error);
      }
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else {
          // Account changed
          setWalletState(prev => ({
            ...prev,
            account: accounts[0],
          }));
          updateBalance();
        }
      };

      const handleChainChanged = () => {
        // Reload the page to handle chain change
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, []);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    switchToBscNetwork,
    updateBalance,
  };
};