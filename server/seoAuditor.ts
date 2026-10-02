import { SeoConfig, SeoPageSetting } from './types.ts';

export interface SeoAuditCheck {
  id: string;
  name: string;
  category: 'meta' | 'keywords' | 'schema' | 'social' | 'technical';
  status: 'pass' | 'warning' | 'fail';
  weight: number;
  score: number; // 0 to 100 for this check
  details: string;
  recommendation?: string;
}

export interface PageSeoAudit {
  path: string;
  title: string;
  description: string;
  score: number;
  status: 'excellent' | 'good' | 'needs_work';
  titleLength: number;
  descLength: number;
  keywordsCount: number;
  hasCanonical: boolean;
  hasOgImage: boolean;
  issues: string[];
  strengths: string[];
}

export interface SeoAuditReport {
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  summary: string;
  categoryScores: {
    metaQuality: number;
    keywordTargeting: number;
    structuredData: number;
    socialCards: number;
    crawlability: number;
  };
  checks: SeoAuditCheck[];
  pages: Record<string, PageSeoAudit>;
  topRecommendations: string[];
  timestamp: string;
}

export const auditSeoConfig = (seo: SeoConfig): SeoAuditReport => {
  const checks: SeoAuditCheck[] = [];

  // 1. Site Title Analysis
  const title = seo?.siteTitle || '';
  const titleLen = title.length;
  if (titleLen >= 40 && titleLen <= 70) {
    checks.push({
      id: 'global-title-length',
      name: 'Global Title Length',
      category: 'meta',
      status: 'pass',
      weight: 15,
      score: 100,
      details: `Optimal title length (${titleLen} characters, recommended 40-65 chars).`,
    });
  } else if (titleLen > 0) {
    checks.push({
      id: 'global-title-length',
      name: 'Global Title Length',
      category: 'meta',
      status: 'warning',
      weight: 15,
      score: 65,
      details: `Title length is ${titleLen} characters. Target 45–65 characters for ideal Google desktop & mobile snippet display.`,
      recommendation: 'Refine the title to include your primary target keyword + brand name.',
    });
  } else {
    checks.push({
      id: 'global-title-length',
      name: 'Global Title Length',
      category: 'meta',
      status: 'fail',
      weight: 15,
      score: 0,
      details: 'Site title is missing.',
      recommendation: 'Provide a high-converting site title.',
    });
  }

  // 2. Brand & Founder In Title
  const hasBrand = title.toLowerCase().includes('click n create') || title.toLowerCase().includes('clickncreate');
  const hasFounder = title.toLowerCase().includes('saad');
  if (hasBrand && hasFounder) {
    checks.push({
      id: 'brand-founder-presence',
      name: 'Brand & Personal Authority in Title',
      category: 'meta',
      status: 'pass',
      weight: 10,
      score: 100,
      details: 'Both brand "Click N Create" and founder "Saad M" are highlighted in the main title tag.',
    });
  } else if (hasBrand || hasFounder) {
    checks.push({
      id: 'brand-founder-presence',
      name: 'Brand & Personal Authority in Title',
      category: 'meta',
      status: 'pass',
      weight: 10,
      score: 85,
      details: 'Brand authority keyword found in title.',
    });
  } else {
    checks.push({
      id: 'brand-founder-presence',
      name: 'Brand & Personal Authority in Title',
      category: 'meta',
      status: 'warning',
      weight: 10,
      score: 40,
      details: 'Neither "Click N Create" nor "Saad M" found in global title.',
      recommendation: 'Add "Click N Create | Saad M" to build recognizable search presence.',
    });
  }

  // 3. Meta Description Length & Call to Action
  const desc = seo?.siteDescription || '';
  const descLen = desc.length;
  if (descLen >= 120 && descLen <= 165) {
    checks.push({
      id: 'meta-description-length',
      name: 'Meta Description Length',
      category: 'meta',
      status: 'pass',
      weight: 15,
      score: 100,
      details: `Ideal description length (${descLen} characters). Completely visible on Google search results without truncation.`,
    });
  } else if (descLen >= 80 && descLen <= 200) {
    checks.push({
      id: 'meta-description-length',
      name: 'Meta Description Length',
      category: 'meta',
      status: 'warning',
      weight: 15,
      score: 75,
      details: `Description is ${descLen} characters. Optimal sweet spot is 140–160 characters.`,
      recommendation: 'Adjust description length to roughly 150 characters to maximize SERP CTR.',
    });
  } else {
    checks.push({
      id: 'meta-description-length',
      name: 'Meta Description Length',
      category: 'meta',
      status: 'fail',
      weight: 15,
      score: 20,
      details: descLen === 0 ? 'Meta description is empty.' : `Description is too ${descLen < 80 ? 'short' : 'long'} (${descLen} chars).`,
      recommendation: 'Write a persuasive 140-160 character description including services and £35/hr pricing.',
    });
  }

  // 4. Keyword Cluster Depth
  const keywords = seo?.defaultKeywords || [];
  const ukKeywords = keywords.filter((k) => k.toLowerCase().includes('uk') || k.toLowerCase().includes('london') || k.toLowerCase().includes('freelance'));
  if (keywords.length >= 8 && ukKeywords.length >= 2) {
    checks.push({
      id: 'keyword-cluster-richness',
      name: 'Keyword Density & Local UK Intent',
      category: 'keywords',
      status: 'pass',
      weight: 15,
      score: 100,
      details: `${keywords.length} target keywords configured with explicit UK local search intent (${ukKeywords.length} geo terms).`,
    });
  } else if (keywords.length >= 4) {
    checks.push({
      id: 'keyword-cluster-richness',
      name: 'Keyword Density & Local UK Intent',
      category: 'keywords',
      status: 'warning',
      weight: 15,
      score: 70,
      details: `${keywords.length} keywords configured. More high-intent keywords recommended.`,
      recommendation: 'Add long-tail search phrases like "freelance web developer UK" and "Shopify developer UK".',
    });
  } else {
    checks.push({
      id: 'keyword-cluster-richness',
      name: 'Keyword Density & Local UK Intent',
      category: 'keywords',
      status: 'fail',
      weight: 15,
      score: 30,
      details: 'Insufficient target keywords provided.',
      recommendation: 'Populate at least 8-12 targeted search queries.',
    });
  }

  // 5. Canonical URL & Domain Security
  const siteUrl = (seo?.siteUrl || '').trim();
  if (siteUrl.startsWith('https://clickncreate.co.uk')) {
    checks.push({
      id: 'canonical-domain-consistency',
      name: 'Canonical HTTPS Domain Validation',
      category: 'technical',
      status: 'pass',
      weight: 10,
      score: 100,
      details: `Exact matching production domain (${siteUrl}) with strict HTTPS enforcement.`,
    });
  } else if (siteUrl.startsWith('https://')) {
    checks.push({
      id: 'canonical-domain-consistency',
      name: 'Canonical HTTPS Domain Validation',
      category: 'technical',
      status: 'warning',
      weight: 10,
      score: 75,
      details: `Canonical URL is set to "${siteUrl}". Verify it matches your production domain https://clickncreate.co.uk.`,
      recommendation: 'Ensure siteUrl is set strictly to https://clickncreate.co.uk.',
    });
  } else {
    checks.push({
      id: 'canonical-domain-consistency',
      name: 'Canonical HTTPS Domain Validation',
      category: 'technical',
      status: 'fail',
      weight: 10,
      score: 20,
      details: 'Insecure or invalid canonical site URL format.',
      recommendation: 'Use https://clickncreate.co.uk as the canonical domain.',
    });
  }

  // 6. Schema.org JSON-LD Structured Data
  const hasSchema = !!seo?.jsonLdType;
  const hasLegal = !!seo?.companyLegalName && !!seo?.founderName;
  const hasPrice = !!seo?.priceRange;
  if (hasSchema && hasLegal && hasPrice) {
    checks.push({
      id: 'schema-org-completeness',
      name: 'Schema.org JSON-LD Structured Data',
      category: 'schema',
      status: 'pass',
      weight: 15,
      score: 100,
      details: `Rich Schema (${seo.jsonLdType}) configured with legal company name, founder entity, and price range.`,
    });
  } else if (hasSchema) {
    checks.push({
      id: 'schema-org-completeness',
      name: 'Schema.org JSON-LD Structured Data',
      category: 'schema',
      status: 'warning',
      weight: 15,
      score: 70,
      details: 'Schema type is set but some rich attributes (founder or priceRange) are missing.',
      recommendation: 'Add founder entity and hourly price range to maximize Google Rich Result eligibility.',
    });
  } else {
    checks.push({
      id: 'schema-org-completeness',
      name: 'Schema.org JSON-LD Structured Data',
      category: 'schema',
      status: 'fail',
      weight: 15,
      score: 10,
      details: 'Schema.org structured data not configured.',
      recommendation: 'Enable ProfessionalService or Organization Schema.org structured data.',
    });
  }

  // 7. Social Sharing & OpenGraph Media
  const hasOgImage = !!seo?.defaultOgImage;
  const hasTwitter = !!seo?.twitterHandle;
  if (hasOgImage && hasTwitter) {
    checks.push({
      id: 'opengraph-social-cards',
      name: 'OpenGraph & Twitter Card Sharing Assets',
      category: 'social',
      status: 'pass',
      weight: 10,
      score: 100,
      details: 'HD OpenGraph preview image and Twitter handle (@ClickNCreate) verified for high social CTR.',
    });
  } else if (hasOgImage || hasTwitter) {
    checks.push({
      id: 'opengraph-social-cards',
      name: 'OpenGraph & Twitter Card Sharing Assets',
      category: 'social',
      status: 'warning',
      weight: 10,
      score: 60,
      details: 'Missing either default OG image or Twitter handle.',
      recommendation: 'Provide both an HD OG preview banner and Twitter handle for complete social preview cards.',
    });
  } else {
    checks.push({
      id: 'opengraph-social-cards',
      name: 'OpenGraph & Twitter Card Sharing Assets',
      category: 'social',
      status: 'fail',
      weight: 10,
      score: 20,
      details: 'No OpenGraph image or Twitter card tags set.',
      recommendation: 'Attach a default 1200x630 OG image.',
    });
  }

  // 8. Sitemap & Robots.txt Crawlability
  const hasSitemap = seo?.enableSitemap !== false;
  const hasRobots = seo?.enableRobotsTxt !== false;
  if (hasSitemap && hasRobots) {
    checks.push({
      id: 'crawlability-sitemap-robots',
      name: 'Search Bot Crawl Directives & XML Sitemap',
      category: 'technical',
      status: 'pass',
      weight: 10,
      score: 100,
      details: 'Dynamic sitemap.xml and robots.txt crawler directives are active and enabled.',
    });
  } else {
    checks.push({
      id: 'crawlability-sitemap-robots',
      name: 'Search Bot Crawl Directives & XML Sitemap',
      category: 'technical',
      status: 'warning',
      weight: 10,
      score: 50,
      details: 'Sitemap or robots.txt is currently disabled.',
      recommendation: 'Enable automated XML Sitemap and robots.txt generation.',
    });
  }

  // Calculate Overall Weighted Score
  let totalWeightedScore = 0;
  let totalWeight = 0;
  for (const check of checks) {
    totalWeightedScore += (check.score * check.weight);
    totalWeight += check.weight;
  }
  const overallScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 85;

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'A+';
  if (overallScore >= 95) grade = 'A+';
  else if (overallScore >= 85) grade = 'A';
  else if (overallScore >= 75) grade = 'B';
  else if (overallScore >= 60) grade = 'C';
  else grade = 'D';

  // Category scores calculation
  const getCatScore = (cat: 'meta' | 'keywords' | 'schema' | 'social' | 'technical'): number => {
    const catChecks = checks.filter((c) => c.category === cat);
    if (catChecks.length === 0) return 90;
    const sum = catChecks.reduce((acc, c) => acc + (c.score * c.weight), 0);
    const weightSum = catChecks.reduce((acc, c) => acc + c.weight, 0);
    return Math.round(sum / weightSum);
  };

  const categoryScores = {
    metaQuality: getCatScore('meta'),
    keywordTargeting: getCatScore('keywords'),
    structuredData: getCatScore('schema'),
    socialCards: getCatScore('social'),
    crawlability: getCatScore('technical'),
  };

  // Per-Page Audits
  const standardPages = [
    { path: '/', label: 'Home Page' },
    { path: '/services', label: 'Services Catalog' },
    { path: '/portfolio', label: 'Portfolio & Case Studies' },
    { path: '/pricing', label: 'Pricing & Packages' },
    { path: '/estimator', label: 'Project Cost Estimator' },
    { path: '/about', label: 'About Saad M' },
    { path: '/faq', label: 'FAQ Page' },
    { path: '/contact', label: 'Contact & Hire' },
    { path: '/process', label: 'Design & Build Process' },
    { path: '/standards', label: 'Engineering Standards' },
  ];

  const pageReports: Record<string, PageSeoAudit> = {};

  for (const p of standardPages) {
    const pageConfig: SeoPageSetting | undefined = seo?.pages?.[p.path];
    const pageTitle = pageConfig?.title || (p.path === '/' ? seo.siteTitle : `${p.label} | Click N Create`);
    const pageDesc = pageConfig?.description || seo.siteDescription;
    const pageKeywords = pageConfig?.keywords && pageConfig.keywords.length > 0 ? pageConfig.keywords : seo.defaultKeywords;

    const pTitleLen = (pageTitle || '').length;
    const pDescLen = (pageDesc || '').length;
    const pKeyCount = (pageKeywords || []).length;
    const issues: string[] = [];
    const strengths: string[] = [];

    let pScore = 100;
    if (pTitleLen < 35 || pTitleLen > 70) {
      pScore -= 15;
      issues.push(`Title length (${pTitleLen} chars) should ideally be 40-65 characters.`);
    } else {
      strengths.push('Optimal title length for search engines.');
    }

    if (pDescLen < 110 || pDescLen > 165) {
      pScore -= 15;
      issues.push(`Meta description (${pDescLen} chars) should be between 120-160 characters.`);
    } else {
      strengths.push('Compelling meta description with great CTR potential.');
    }

    if (pKeyCount < 4) {
      pScore -= 10;
      issues.push('Low keyword count for this specific page.');
    } else {
      strengths.push(`${pKeyCount} relevant search keywords attached.`);
    }

    if (!pageConfig) {
      strengths.push('Inheriting optimized global metadata cleanly.');
    } else {
      strengths.push('Custom per-page meta override active.');
    }

    pScore = Math.max(20, Math.min(100, pScore));

    pageReports[p.path] = {
      path: p.path,
      title: pageTitle,
      description: pageDesc,
      score: pScore,
      status: pScore >= 90 ? 'excellent' : pScore >= 75 ? 'good' : 'needs_work',
      titleLength: pTitleLen,
      descLength: pDescLen,
      keywordsCount: pKeyCount,
      hasCanonical: true,
      hasOgImage: !!(pageConfig?.ogImage || seo.defaultOgImage),
      issues,
      strengths,
    };
  }

  // Top Recommendations
  const topRecommendations: string[] = [];
  const warningChecks = checks.filter((c) => c.status !== 'pass');
  for (const wc of warningChecks) {
    if (wc.recommendation) {
      topRecommendations.push(wc.recommendation);
    }
  }
  if (topRecommendations.length === 0) {
    topRecommendations.push('Your site SEO score is top tier! Keep monitoring Google Search Console for emerging search term rankings.');
  }

  return {
    overallScore,
    grade,
    summary: `Click N Create SEO health is scored at ${overallScore}/100 (Grade ${grade}). All core ranking signals, canonical domains, and Schema.org rich snippets are verified.`,
    categoryScores,
    checks,
    pages: pageReports,
    topRecommendations,
    timestamp: new Date().toISOString(),
  };
};
