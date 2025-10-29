// src/components/SEOHead.tsx

import { Helmet } from 'react-helmet-async';
import { 
  generateOrganizationSchema, 
  generateWebSiteSchema, 
  generateArticleSchema, 
  generateBreadcrumbSchema,
  generateCryptoCurrencySchema
} from '@/utils/structuredData';

interface SEOHeadProps {
  title?: string;
  description?: string;
  path?: string;
  type?: string;
  image?: string;
}

const SEOHead = ({
  title = "YAPS COIN 🚀 - The Funniest Coin in The Galaxy",
  description = "YAPS COIN - The funniest meme coin in the galaxy! Join the memetic revolution with our Binance Smart Chain token. Buy, hold, and enjoy the ride to the moon! 🚀",
  path = "/",
  type = "website",
  image = "/og-image.jpg"
}: SEOHeadProps) => {
  const canonicalUrl = `https://yapscoin.com${path}`;
  
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();
  const articleSchema = generateArticleSchema();
  const breadcrumbSchema = generateBreadcrumbSchema();
  const cryptoCurrencySchema = generateCryptoCurrencySchema();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="YAPS COIN - The funniest meme coin in the galaxy" />
      <meta property="og:site_name" content="YAPS COIN" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="YAPS COIN - The funniest meme coin in the galaxy" />
      <meta name="twitter:site" content="@yapscoin" />
      <meta name="twitter:creator" content="@yapscoin" />
      
      {/* Structured Data JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(cryptoCurrencySchema)}
      </script>
    </Helmet>
  );
};

export default SEOHead;