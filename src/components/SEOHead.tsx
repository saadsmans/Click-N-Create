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
  breadcrumbs?: Array<{ name: string; path: string }>;
}

const DEFAULT_KEYWORDS = [
  'freelance web developer UK',
  'Click N Create',
  'clickncreate.co.uk',
  'Saad M developer',
  'hire freelance web developer',
  'custom website design UK',
  'React TypeScript developer UK',
  'WordPress developer UK',
  'Shopify ecommerce developer',
  'affordable web developer £35/hr',
  'high speed website optimization',
  'custom web applications UK',
  'interactive price calculator',
  'freelance UI UX designer',
  'front end developer London UK'
];

export const SEOHead: React.FC<SEOHeadProps> = ({
  title: defaultTitle,
  description: defaultDesc,
  keywords = [],
  canonicalPath = '',
  ogType = 'website',
  ogImage = '/file_00000000440061f7b67bc59e52b0df8e.png',
  schemaJson,
  breadcrumbs
}) => {
  const { customization } = useCustomization();
  const seoConfig = customization?.seo;
  const pageOverride = canonicalPath ? seoConfig?.pages?.[canonicalPath] : undefined;

  const effectiveTitle = pageOverride?.title || defaultTitle;
  const effectiveDesc = pageOverride?.description || defaultDesc;
  const effectiveKeywords = pageOverride?.keywords && pageOverride.keywords.length > 0 ? pageOverride.keywords : keywords;

  const fullTitle = effectiveTitle.includes('Click N Create') ? effectiveTitle : `${effectiveTitle} | Click N Create — Saad M`;
  const combinedKeywords = Array.from(new Set([...effectiveKeywords, ...DEFAULT_KEYWORDS])).join(', ');
  
  const siteDomain = 'https://clickncreate.co.uk';
  const cleanPath = canonicalPath ? (canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`) : '';
  const canonicalUrl = `${siteDomain}${cleanPath}`;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteDomain}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;

  // Auto-generate BreadcrumbList Schema for Google rich search results
  const defaultBreadcrumbs = breadcrumbs || (cleanPath && cleanPath !== '/' ? [
    { name: 'Home', path: '/' },
    { name: effectiveTitle.split('|')[0].trim(), path: cleanPath }
  ] : [{ name: 'Home', path: '/' }]);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': defaultBreadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': crumb.name,
      'item': `${siteDomain}${crumb.path === '/' ? '' : crumb.path}`
    }))
  };

  const schemasToRender: any[] = [];
  if (breadcrumbSchema) {
    schemasToRender.push(breadcrumbSchema);
  }
  if (schemaJson) {
    if (Array.isArray(schemaJson)) {
      schemasToRender.push(...schemaJson);
    } else {
      schemasToRender.push(schemaJson);
    }
  }

  const themeTokens = customization?.theme;
  const customSiteIcon =
    themeTokens?.customSiteIconUrl && themeTokens.customSiteIconUrl.trim() !== ''
      ? themeTokens.customSiteIconUrl
      : null;

  // Sync favicon with DOM immediately on dynamic updates
  React.useEffect(() => {
    const iconHref = customSiteIcon || '/favicon-32x32.png';
    const iconLinks = document.querySelectorAll<HTMLLinkElement>(
      "link[rel*='icon'], link[rel='apple-touch-icon']"
    );
    iconLinks.forEach((link) => {
      link.href = iconHref;
    });
  }, [customSiteIcon]);

  return (
    <Helmet>
      {/* Primary Metadata */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={effectiveDesc} />
      <meta name="keywords" content={combinedKeywords} />
      <meta name="author" content="Saad M — Click N Create" />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-gb" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Dynamic Site Favicon & Browser Icons */}
      {customSiteIcon ? (
        <>
          <link rel="icon" href={customSiteIcon} />
          <link rel="apple-touch-icon" href={customSiteIcon} />
          <link rel="shortcut icon" href={customSiteIcon} />
        </>
      ) : (
        <>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="icon" type="image/png" sizes="512x512" href="/favicon.png" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </>
      )}

      {/* OpenGraph / Facebook / LinkedIn / WhatsApp */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Click N Create | Saad M — Freelance Web Developer" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={effectiveDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Click N Create — Freelance Web Developer Saad M" />
      <meta property="og:locale" content="en_GB" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@ClickNCreate" />
      <meta name="twitter:creator" content="@ClickNCreate" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={effectiveDesc} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Geo Tags & Local Business SEO */}
      <meta name="geo.region" content="GB" />
      <meta name="geo.placename" content="United Kingdom" />
      <meta name="format-detection" content="telephone=no" />

      {/* Structured Data (Schema.org JSON-LD) */}
      {schemasToRender.map((schema, index) => (
        <script key={`schema-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
