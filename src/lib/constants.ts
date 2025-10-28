// src/lib/constants.ts

// YAPS COIN Configuration
export const YAPS_CONFIG = {
  // Token addresses - to be updated after token launch
  TOKEN_ADDRESS: import.meta.env.VITE_YAPS_TOKEN_ADDRESS || "YOUR_YAPS_TOKEN_ADDRESS",
  ROUTER_ADDRESS: import.meta.env.VITE_YAPS_ROUTER_ADDRESS || "YOUR_ROUTER_ADDRESS",
  
  // Exchange URLs - update with actual addresses after launch
  EXCHANGE_URL: import.meta.env.VITE_YAPS_EXCHANGE_URL || "https://pancakeswap.finance/swap?outputCurrency=YOUR_YAPS_TOKEN_ADDRESS",
  CHART_URL: import.meta.env.VITE_YAPS_CHART_URL || "https://www.dextools.io/app/en/bsc/pair-explorer/YOUR_YAPS_TOKEN_ADDRESS",
  
  // Social links
  SOCIAL_LINKS: {
    telegram: import.meta.env.VITE_YAPS_TELEGRAM_URL || "https://t.me/YAPSofficial",
    twitter: import.meta.env.VITE_YAPS_TWITTER_URL || "https://x.com/yapscoin",
    discord: import.meta.env.VITE_YAPS_DISCORD_URL || "",
    website: import.meta.env.VITE_YAPS_WEBSITE_URL || "",
  },
  
  // Contract addresses (to be updated after deployment)
  CONTRACTS: {
    token: import.meta.env.VITE_YAPS_TOKEN_CONTRACT || "",
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