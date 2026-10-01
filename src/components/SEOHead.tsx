import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_CONFIG } from '../data/site.ts';
import { useCustomization } from '../context/CustomizationContext.tsx';

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalPath?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  schemaJson?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_KEYWORDS = [
  'freelance web developer',
  'freelance website developer',
  'hire web developer',
  'custom react website',
  'wordpress developer',
  'ecommerce web developer',
  'Click N Create',
  'Saad M developer',
  'front end developer UK India',
  'modern responsive websites',
  'custom web applications',
  'cost calculator website'
];

export const SEOHead: React.FC<SEOHeadProps> = ({
  title: defaultTitle,
  description: defaultDesc,
  keywords = [],
  canonicalPath = '',
  ogType = 'website',
  ogImage = '/file_00000000440061f7b67bc59e52b0df8e.png',
  schemaJson
}) => {
  const { customization } = useCustomization();
  const seoConfig = customization?.seo;
  const pageOverride = canonicalPath ? seoConfig?.pages?.[canonicalPath] : undefined;

  const effectiveTitle = pageOverride?.title || defaultTitle;
  const effectiveDesc = pageOverride?.description || defaultDesc;
  const effectiveKeywords = pageOverride?.keywords && pageOverride.keywords.length > 0 ? pageOverride.keywords : keywords;

  const fullTitle = effectiveTitle.includes('Click N Create') ? effectiveTitle : `${effectiveTitle} | Click N Create — Saad M`;
  const combinedKeywords = Array.from(new Set([...effectiveKeywords, ...DEFAULT_KEYWORDS])).join(', ');
  
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://clickncreate.co.uk';
  const canonicalUrl = `${origin}${canonicalPath ? (canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`) : ''}`;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${origin}${ogImage}`;

  return (
    <Helmet>
      {/* Primary Metadata */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={effectiveDesc} />
      <meta name="keywords" content={combinedKeywords} />
      <meta name="author" content="Saad M — Click N Create" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      {/* OpenGraph / Facebook / LinkedIn */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Click N Create | Freelance Web Developer" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={effectiveDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:locale" content="en_GB" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={effectiveDesc} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:creator" content="@ClickNCreate" />

      {/* Geo Tags & Theme */}
      <meta name="geo.region" content="GB;IN" />
      <meta name="geo.placename" content="United Kingdom, India" />

      {/* Structured Data (Schema.org JSON-LD) */}
      {schemaJson && (
        <script type="application/ld+json">
          {JSON.stringify(schemaJson)}
        </script>
      )}
    </Helmet>
  );
};
