// src/utils/structuredData.ts

/**
 * Utility functions to generate SEO structured data (JSON-LD)
 */

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "YAPS COIN",
    "description": "The funniest meme coin in the galaxy! Join the memetic revolution with our Binance Smart Chain token.",
    "url": "https://yapscoin.com/",
    "logo": "/assets/webp/yaps-logo.webp",
    "foundingDate": "2025",
    "founders": ["YAPS Community"],
    "areaServed": "Worldwide",
    "slogan": "Where Memes Meet Money",
    "keywords": "YAPS COIN, meme coin, BSC, cryptocurrency, crypto, token, community, blockchain, DeFi, PancakeSwap",
    "sameAs": [
      "https://t.me/YAPSofficial",
      "https://x.com/yapscoin"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@yapscoin.com"
    },
    "potentialAction": {
      "@type": "BuyAction",
      "target": "https://pancakeswap.finance/swap?outputCurrency=YOUR_YAPS_TOKEN_ADDRESS"
    }
  };
};

export const generateWebSiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "YAPS COIN",
    "url": "https://yapscoin.com/",
    "description": "The funniest meme coin in the galaxy! Join the memetic revolution with our Binance Smart Chain token.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://yapscoin.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
};

export const generateArticleSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "YAPS COIN - The Funniest Coin in The Galaxy",
    "description": "Join the memetic revolution! YAPS COIN - Where memes meet money on Binance Smart Chain. Moon with us!",
    "author": {
      "@type": "Organization",
      "name": "YAPS COIN Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "YAPS COIN",
      "logo": {
        "@type": "ImageObject",
        "url": "/assets/webp/yaps-logo.webp"
      }
    },
    "datePublished": "2025-01-01",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://yapscoin.com/"
    }
  };
};

export const generateBreadcrumbSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://yapscoin.com/"
    }]
  };
};

export const generateCryptoCurrencySchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Cryptocurrency",
    "name": "YAPS COIN",
    "symbol": "YAPS",
    "description": "A meme cryptocurrency built on Binance Smart Chain focused on community and fun",
    "tickerSymbol": "YAPS",
    "url": "https://yapscoin.com/",
    "logo": "/assets/webp/yaps-logo.webp",
    "sameAs": [
      "https://pancakeswap.finance/swap?outputCurrency=YOUR_YAPS_TOKEN_ADDRESS",
      "https://www.dextools.io/app/en/bsc/pair-explorer/YOUR_YAPS_TOKEN_ADDRESS"
    ],
    "creator": {
      "@type": "Organization",
      "name": "YAPS Community"
    },
    "initialSupply": "1000000000000",
    "totalSupply": "1000000000000"
  };
};