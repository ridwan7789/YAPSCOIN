import { YAPS_CONFIG } from "@/lib/constants";

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply?: string;
  logoURI?: string;
}

// Common BSC tokens for quick access
export const COMMON_BSC_TOKENS: TokenInfo[] = [
  {
    address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB
    name: "Wrapped BNB",
    symbol: "WBNB",
    decimals: 18,
    logoURI: "https://assets.pancakeswap.finance/web3/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.png"
  },
  {
    address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // BUSD
    name: "Binance-Peg BUSD Token",
    symbol: "BUSD",
    decimals: 18,
    logoURI: "https://assets.pancakeswap.finance/web3/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56.png"
  },
  {
    address: "0x55d398326f99059fF775485246999027B3197955", // USDT
    name: "Tether USD",
    symbol: "USDT",
    decimals: 18,
    logoURI: "https://assets.pancakeswap.finance/web3/0x55d398326f99059fF775485246999027B3197955.png"
  },
  {
    address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", // USDC
    name: "USD Coin",
    symbol: "USDC",
    decimals: 18,
    logoURI: "https://assets.pancakeswap.finance/web3/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d.png"
  },
  {
    address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", // ETH
    name: "Binance-Peg Ethereum Token",
    symbol: "ETH",
    decimals: 18,
    logoURI: "https://assets.pancakeswap.finance/web3/0x2170Ed0880ac9A755fd29B2688956BD959F933F8.png"
  },
  {
    address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c", // BTCB
    name: "Binance-Peg BTCB Token",
    symbol: "BTCB",
    decimals: 18,
    logoURI: "https://assets.pancakeswap.finance/web3/0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c.png"
  },
  {
    address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3", // DAI
    name: "Dai Stablecoin",
    symbol: "DAI",
    decimals: 18,
    logoURI: "https://assets.pancakeswap.finance/web3/0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3.png"
  }
];

// Function to fetch tokens from PancakeSwap API
export const fetchPancakeSwapTokens = async (): Promise<TokenInfo[]> => {
  try {
    // For now, use a more basic query that's less likely to fail
    // Since the API is failing, we'll only use the fallback
    console.warn('PancakeSwap API temporarily disabled due to server errors, using common tokens only');
    return COMMON_BSC_TOKENS;
  } catch (error) {
    console.warn('Error fetching PancakeSwap tokens, using fallback:', error);
    // Return common tokens as fallback
    return COMMON_BSC_TOKENS;
  }
};

// Function to search for tokens
export const searchTokens = async (query: string): Promise<TokenInfo[]> => {
  const lowerQuery = query.toLowerCase();
  
  // First, try to get tokens from PancakeSwap
  try {
    const tokens = await fetchPancakeSwapTokens();
    
    // Filter tokens based on the query
    const filteredTokens = tokens.filter(token => 
      token.symbol.toLowerCase().includes(lowerQuery) || 
      token.name.toLowerCase().includes(lowerQuery) ||
      token.address.toLowerCase().includes(lowerQuery)
    );
    
    // If we have results from the API, return them
    if (filteredTokens.length > 0) {
      return filteredTokens;
    }
    
    // Otherwise, also search in common tokens
    const commonFiltered = COMMON_BSC_TOKENS.filter(token => 
      token.symbol.toLowerCase().includes(lowerQuery) || 
      token.name.toLowerCase().includes(lowerQuery) ||
      token.address.toLowerCase().includes(lowerQuery)
    );
    
    // Combine results, prioritizing API results
    return [...filteredTokens, ...commonFiltered];
  } catch (error) {
    console.error('Error searching tokens:', error);
    // If API fails, search in common tokens
    return COMMON_BSC_TOKENS.filter(token => 
      token.symbol.toLowerCase().includes(lowerQuery) || 
      token.name.toLowerCase().includes(lowerQuery) ||
      token.address.toLowerCase().includes(lowerQuery)
    );
  }
};

// Function to get token info by address
export const getTokenByAddress = async (address: string): Promise<TokenInfo | null> => {
  try {
    // First try to find in common tokens
    const commonToken = COMMON_BSC_TOKENS.find(token => 
      token.address.toLowerCase() === address.toLowerCase()
    );
    
    if (commonToken) {
      return commonToken;
    }
    
    // Try to fetch from PancakeSwap
    const tokens = await fetchPancakeSwapTokens();
    const token = tokens.find(t => 
      t.address.toLowerCase() === address.toLowerCase()
    );
    
    return token || null;
  } catch (error) {
    console.error('Error getting token by address:', error);
    return null;
  }
};