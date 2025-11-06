// src/lib/constants.ts

// YAPS COIN Configuration
export const YAPS_CONFIG = {
  // Token addresses - to be updated after token launch
  TOKEN_ADDRESS: import.meta.env.VITE_YAPS_TOKEN_ADDRESS || "0x803e02A4DC72fd29216A1dD2AE5cEB004136b4ae", // This should be updated with actual YAPS token address after launch
  ROUTER_ADDRESS: import.meta.env.VITE_YAPS_ROUTER_ADDRESS || "YOUR_ROUTER_ADDRESS", // This should be updated with actual router address after launch
  
  // Yapswap configuration - using actual PancakeSwap router address
  YAPSWAP: {
    ROUTER_ADDRESS: import.meta.env.VITE_YAPSWAP_ROUTER_ADDRESS || "0x10ED43C718714eb63d5aA57B78B54704E256024E", // PancakeSwap router address on BSC
    EXCHANGE_URL: import.meta.env.VITE_YAPSWAP_URL || "/swap", // Internal Yapswap page
  },
  
  // Exchange URLs - update with actual addresses after launch
  EXCHANGE_URL: import.meta.env.VITE_YAPS_EXCHANGE_URL || "https://pancakeswap.finance/swap?outputCurrency=0x803e02A4DC72fd29216A1dD2AE5cEB004136b4ae",
  CHART_URL: import.meta.env.VITE_YAPS_CHART_URL || "https://www.dextools.io/app/en/bsc/pair-explorer/0x803e02A4DC72fd29216A1dD2AE5cEB004136b4ae",
  
  // Social links
  SOCIAL_LINKS: {
    telegram: import.meta.env.VITE_YAPS_TELEGRAM_URL || "https://t.me/YAPSofficial",
    twitter: import.meta.env.VITE_YAPS_TWITTER_URL || "https://x.com/yapscoin",
    discord: import.meta.env.VITE_YAPS_DISCORD_URL || "",
    website: import.meta.env.VITE_YAPS_WEBSITE_URL || "",
  },
  
  // Contract addresses (to be updated after deployment)
  CONTRACTS: {
    token: import.meta.env.VITE_YAPS_TOKEN_CONTRACT || "0x803e02A4DC72fd29216A1dD2AE5cEB004136b4ae",
    staking: import.meta.env.VITE_YAPS_STAKING_CONTRACT || "",
    lottery: import.meta.env.VITE_YAPS_LOTTERY_CONTRACT || "",
  },
  
  // Network configuration
  NETWORK: {
    chainId: import.meta.env.VITE_YAPS_CHAIN_ID || "56", // BSC mainnet
    name: import.meta.env.VITE_YAPS_NETWORK_NAME || "Binance Smart Chain",
    rpcUrl: import.meta.env.VITE_YAPS_RPC_URL || "https://bsc-dataseed.binance.org/",
    explorerUrl: import.meta.env.VITE_YAPS_EXPLORER_URL || "https://bscscan.com/",
  },
  
  // API configuration
  API: {
    NODE_REAL: {
      RPC_URL: import.meta.env.VITE_NODE_REAL_RPC_URL || "https://bsc-mainnet.nodereal.io/v1/b8e4e9879e7b45f3b71ccf8c843d7fa1",
      PANCAKESWAP_GRAPHQL: import.meta.env.VITE_PANCAKESWAP_GRAPHQL || "https://open-platform.nodereal.io/b8e4e9879e7b45f3b71ccf8c843d7fa1/pancakeswap-free/graphql",
    },
    COINGECKO: {
      API_URL: "https://api.coingecko.com/api/v3",
    }
  },
  
  // App settings
  APP_NAME: "YAPS COIN",
  APP_DESCRIPTION: "The funniest, most unpredictable crypto experience in the galaxy! HODL with laughter and maybe moon with us!",
  APP_KEYWORDS: ["yaps", "coin", "crypto", "meme", "bsc", "binance", "community"],
  
  // Animation settings
  ANIMATION: {
    starCount: 50,
    floatDuration: 3, // seconds
    glowIntensity: 20,
  },
} as const;