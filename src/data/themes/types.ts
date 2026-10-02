export interface ThemePreset {
  id: string;
  name: string;
  category: 'Cyber & Sci-Fi' | 'Luxury & Editorial' | 'Modern SaaS & Tech' | 'Neo-Brutalist & Retro' | 'Nature & Organic';
  tagline: string;
  accentPrimary: string;
  accentSecondary: string;
  accentGradient: string;
  bgTone: string;
  bgMainDark: string;
  bgSecondaryDark: string;
  bgMainLight: string;
  bgSecondaryLight: string;
  textColorDark: string;
  textColorLight: string;
  fontDisplay: string;
  fontSans: string;
  fontMono: string;
  borderRadius: 'sharp' | 'minimal' | 'modern' | 'soft' | 'pill';
  borderWidth: 'none' | 'thin' | 'bold' | 'brutalist';
  glowIntensity: 'none' | 'subtle' | 'medium' | 'cyber' | 'brutalist';
  buttonStyle: 'glow' | 'flat' | 'brutalist' | 'outline' | 'glass';
  headerStyle: string;
  footerStyle: string;
  dropdownStyle: string;
  backgroundPattern: 'grid' | 'dots' | 'noise' | 'clean' | 'aurora' | 'circuit' | 'scanlines' | 'mesh';
}

export interface FontOption {
  family: string;
  category: 'Display' | 'Sans-Serif' | 'Serif' | 'Monospace' | 'Futuristic' | 'Script';
  googleFontSlug?: string;
  weights: string[];
  previewText?: string;
}

const FONTSHARE_FONTS: Record<string, string> = {
  'Clash Display': 'https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap',
  'Cabinet Grotesk': 'https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800&display=swap',
  'General Sans': 'https://api.fontshare.com/v2/css?f[]=general-sans@400,600,700&display=swap',
};

export function loadGoogleFont(family: string, weights?: string[]) {
  if (typeof document === 'undefined' || !family) return;
  const id = `gfont-${family.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(id)) return;

  // Handle Fontshare CDN fonts
  if (FONTSHARE_FONTS[family]) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = FONTSHARE_FONTS[family];
    document.head.appendChild(link);
    return;
  }

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  const weightParam = weights && weights.length > 0 ? `:wght@${weights.join(';')}` : '';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}${weightParam}&display=swap`;
  document.head.appendChild(link);
}

export function loadGoogleFontsBatch(families: string[]) {
  if (typeof document === 'undefined' || !families || families.length === 0) return;

  // Load any Fontshare fonts first
  const fontshareId = 'fontshare-bundle';
  if (!document.getElementById(fontshareId)) {
    const link = document.createElement('link');
    link.id = fontshareId;
    link.rel = 'stylesheet';
    link.href = 'https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=cabinet-grotesk@700,800&f[]=general-sans@400,600,700&display=swap';
    document.head.appendChild(link);
  }

  // Filter out non-Google fonts so Google Fonts API doesn't return 400
  const validGoogleFamilies = families.filter((f) => !FONTSHARE_FONTS[f]);

  const BATCH_SIZE = 10;
  for (let i = 0; i < validGoogleFamilies.length; i += BATCH_SIZE) {
    const chunk = validGoogleFamilies.slice(i, i + BATCH_SIZE);
    const chunkId = `gfonts-chunk-${i}`;
    if (document.getElementById(chunkId)) continue;

    const query = chunk
      .map((fam) => `family=${encodeURIComponent(fam)}`)
      .join('&');

    const link = document.createElement('link');
    link.id = chunkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${query}&display=swap`;
    document.head.appendChild(link);
  }
}
