import { CYBER_THEMES } from './themes/cyberThemes.ts';
import { LUXURY_THEMES } from './themes/luxuryThemes.ts';
import { SAAS_THEMES } from './themes/saasThemes.ts';
import { BRUTALIST_THEMES } from './themes/brutalistThemes.ts';
import { NATURE_THEMES } from './themes/natureThemes.ts';

export * from './themes/types.ts';
export * from './themes/fontCatalog.ts';

export const THEME_PRESETS = [
  ...CYBER_THEMES,       // 20
  ...LUXURY_THEMES,      // 20
  ...SAAS_THEMES,        // 20
  ...BRUTALIST_THEMES,   // 20
  ...NATURE_THEMES,      // 20
];
