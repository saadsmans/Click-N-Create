import fs from 'fs';
import { dropdownShapes, headerShapes, footerShapes } from './shapesData.js';

// Read all 5 theme files
const files = [
  'src/data/themes/cyberThemes.ts',
  'src/data/themes/luxuryThemes.ts',
  'src/data/themes/saasThemes.ts',
  'src/data/themes/brutalistThemes.ts',
  'src/data/themes/natureThemes.ts'
];

let globalIdx = 0;
const themeConfigs = [];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  // Match theme objects: id: 'something'
  const idRegex = /id:\s*'([^']+)'/g;
  let match;
  const themeIds = [];
  while ((match = idRegex.exec(content)) !== null) {
    themeIds.push(match[1]);
  }

  for (const id of themeIds) {
    const idx = globalIdx;
    const hdrStyle = `hdr_${id}`;
    const ftrStyle = `ftr_${id}`;
    const ddStyle = `dd_${id}`;
    themeConfigs.push({
      id,
      index: idx,
      headerStyle: hdrStyle,
      footerStyle: ftrStyle,
      dropdownStyle: ddStyle,
      headerShape: headerShapes[idx],
      footerShape: footerShapes[idx],
      dropdownShape: dropdownShapes[idx]
    });
    globalIdx++;
  }

  // Now replace headerStyle, footerStyle, dropdownStyle in this file
  // We can do it by parsing objects or regex matching per preset block
  for (const t of themeConfigs.slice(themeConfigs.length - themeIds.length)) {
    // Regex for block containing id: '${t.id}'
    const blockRegex = new RegExp(`(id:\\s*'${t.id}'[\\s\\S]*?headerStyle:\\s*')([^']+)('[\\s\\S]*?footerStyle:\\s*')([^']+)('[\\s\\S]*?dropdownStyle:\\s*')([^']+)(')`);
    content = content.replace(blockRegex, `$1${t.headerStyle}$3${t.footerStyle}$5${t.dropdownStyle}$7`);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file} with unique styles`);
}

// Generate src/data/themes/themeArchitectureStyles.ts
const archContent = `// Auto-generated 100 Unique Architecture Shapes & Styles for All 100 Themes
// Each of the 100 themes has an entirely unique header style & shape, footer style & shape, and dropdown box style & shape.

export interface StyleMapping {
  dark: string;
  light: string;
}

export const THEME_HEADER_STYLES: Record<string, StyleMapping> = {
${themeConfigs.map(t => `  '${t.headerStyle}': {
    dark: '${t.headerShape} bg-[#06060F]/90 text-white backdrop-blur-2xl',
    light: '${t.headerShape} bg-white/92 text-zinc-950 backdrop-blur-2xl'
  },
  '${t.id}': {
    dark: '${t.headerShape} bg-[#06060F]/90 text-white backdrop-blur-2xl',
    light: '${t.headerShape} bg-white/92 text-zinc-950 backdrop-blur-2xl'
  },`).join('\n')}
};

export const THEME_DROPDOWN_STYLES: Record<string, StyleMapping> = {
${themeConfigs.map(t => `  '${t.dropdownStyle}': {
    dark: '${t.dropdownShape} bg-[#0A0A16]/98 text-white',
    light: '${t.dropdownShape} bg-white/98 text-zinc-950'
  },
  '${t.id}': {
    dark: '${t.dropdownShape} bg-[#0A0A16]/98 text-white',
    light: '${t.dropdownShape} bg-white/98 text-zinc-950'
  },`).join('\n')}
};

export const THEME_FOOTER_STYLES: Record<string, StyleMapping> = {
${themeConfigs.map(t => `  '${t.footerStyle}': {
    dark: '${t.footerShape} bg-[#06060E] text-white',
    light: '${t.footerShape} bg-white text-zinc-950'
  },
  '${t.id}': {
    dark: '${t.footerShape} bg-[#06060E] text-white',
    light: '${t.footerShape} bg-white text-zinc-950'
  },`).join('\n')}
};

// Legacy fallback dictionary for older preset keys
export const LEGACY_HEADER_STYLES: Record<string, StyleMapping> = {
  solid_bar: {
    dark: 'max-w-7xl px-6 py-3 rounded-none border-b-2 border-white/15 bg-[#07070F]/95 backdrop-blur-2xl shadow-xl text-white',
    light: 'max-w-7xl px-6 py-3 rounded-none border-b-2 border-zinc-300 bg-white/95 backdrop-blur-2xl shadow-md text-zinc-950'
  },
  editorial_clean: {
    dark: 'max-w-5xl px-6 py-2.5 rounded-none border-b border-white/20 bg-black/80 backdrop-blur-xl text-white',
    light: 'max-w-5xl px-6 py-2.5 rounded-none border-b border-zinc-300 bg-white/80 backdrop-blur-xl text-zinc-950'
  },
  cyber_hud: {
    dark: 'max-w-5xl px-5 py-2.5 rounded-lg border-2 border-cyan-400 bg-[#050510]/95 shadow-[0_0_35px_rgba(0,240,255,0.3)] text-white',
    light: 'max-w-5xl px-5 py-2.5 rounded-lg border-2 border-cyan-500 bg-white/95 shadow-xl text-zinc-950'
  },
  brutalist_stark: {
    dark: 'max-w-5xl px-5 py-2.5 rounded-none border-3 border-white bg-[#121212] shadow-[4px_4px_0px_#FFF] text-white',
    light: 'max-w-5xl px-5 py-2.5 rounded-none border-3 border-black bg-[#FFFDF0] shadow-[4px_4px_0px_#000] text-black'
  },
  floating_glass: {
    dark: 'max-w-5xl px-4 sm:px-6 py-2.5 rounded-full border border-[#00F0FF]/35 bg-[#06060F]/90 backdrop-blur-2xl shadow-[0_10px_40px_-5px_rgba(0,240,255,0.22)] text-white',
    light: 'max-w-5xl px-4 sm:px-6 py-2.5 rounded-full border border-cyan-500/40 bg-white/92 backdrop-blur-2xl shadow-[0_10px_35px_-5px_rgba(0,180,216,0.18)] text-zinc-950'
  }
};

export const LEGACY_DROPDOWN_STYLES: Record<string, StyleMapping> = {
  brutalist_sharp: {
    dark: 'rounded-none border-3 border-white bg-[#121212] shadow-[6px_6px_0px_#FFF] p-4 text-white',
    light: 'rounded-none border-3 border-black bg-[#FFFDF0] shadow-[6px_6px_0px_#000] p-4 text-black'
  },
  cyber_hud: {
    dark: 'rounded-lg border-2 border-[#00F0FF] bg-[#020603]/98 shadow-[0_0_35px_rgba(0,240,255,0.3)] p-4 font-mono text-[#00F0FF]',
    light: 'rounded-lg border-2 border-cyan-600 bg-white/98 shadow-2xl p-4 font-mono text-cyan-900'
  },
  glass_blur: {
    dark: 'rounded-3xl border border-[#00F0FF]/40 bg-[#0A0A16]/98 shadow-[0_15px_50px_rgba(0,240,255,0.22)] backdrop-blur-2xl p-4 text-white',
    light: 'rounded-3xl border border-cyan-400/50 bg-white/98 shadow-2xl backdrop-blur-2xl p-4 text-zinc-950'
  }
};

export const LEGACY_FOOTER_STYLES: Record<string, StyleMapping> = {
  modern_columns: {
    dark: 'rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-12 border border-[#00F0FF]/25 bg-[#06060E] text-white shadow-[0_25px_70px_rgba(0,0,0,0.8)]',
    light: 'rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-12 border border-cyan-300 bg-white text-zinc-950 shadow-[0_20px_50px_rgba(0,180,216,0.15)]'
  }
};

export function getHeaderClass(styleKey?: string, presetId?: string, isDark: boolean = true): string {
  const key = styleKey || presetId || 'floating_glass';
  if (THEME_HEADER_STYLES[key]) {
    return isDark ? THEME_HEADER_STYLES[key].dark : THEME_HEADER_STYLES[key].light;
  }
  if (presetId && THEME_HEADER_STYLES[presetId]) {
    return isDark ? THEME_HEADER_STYLES[presetId].dark : THEME_HEADER_STYLES[presetId].light;
  }
  if (LEGACY_HEADER_STYLES[key]) {
    return isDark ? LEGACY_HEADER_STYLES[key].dark : LEGACY_HEADER_STYLES[key].light;
  }
  return isDark ? THEME_HEADER_STYLES['hdr_cyber_cyan'].dark : THEME_HEADER_STYLES['hdr_cyber_cyan'].light;
}

export function getDropdownClass(styleKey?: string, presetId?: string, isDark: boolean = true): string {
  const key = styleKey || presetId || 'glass_blur';
  if (THEME_DROPDOWN_STYLES[key]) {
    return isDark ? THEME_DROPDOWN_STYLES[key].dark : THEME_DROPDOWN_STYLES[key].light;
  }
  if (presetId && THEME_DROPDOWN_STYLES[presetId]) {
    return isDark ? THEME_DROPDOWN_STYLES[presetId].dark : THEME_DROPDOWN_STYLES[presetId].light;
  }
  if (LEGACY_DROPDOWN_STYLES[key]) {
    return isDark ? LEGACY_DROPDOWN_STYLES[key].dark : LEGACY_DROPDOWN_STYLES[key].light;
  }
  return isDark ? THEME_DROPDOWN_STYLES['dd_cyber_cyan'].dark : THEME_DROPDOWN_STYLES['dd_cyber_cyan'].light;
}

export function getFooterClass(styleKey?: string, presetId?: string, isDark: boolean = true): string {
  const key = styleKey || presetId || 'modern_columns';
  if (THEME_FOOTER_STYLES[key]) {
    return isDark ? THEME_FOOTER_STYLES[key].dark : THEME_FOOTER_STYLES[key].light;
  }
  if (presetId && THEME_FOOTER_STYLES[presetId]) {
    return isDark ? THEME_FOOTER_STYLES[presetId].dark : THEME_FOOTER_STYLES[presetId].light;
  }
  if (LEGACY_FOOTER_STYLES[key]) {
    return isDark ? LEGACY_FOOTER_STYLES[key].dark : LEGACY_FOOTER_STYLES[key].light;
  }
  return isDark ? THEME_FOOTER_STYLES['ftr_cyber_cyan'].dark : THEME_FOOTER_STYLES['ftr_cyber_cyan'].light;
}
`;

fs.writeFileSync('src/data/themes/themeArchitectureStyles.ts', archContent, 'utf8');
console.log('src/data/themes/themeArchitectureStyles.ts generated successfully!');
