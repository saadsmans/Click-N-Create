import fs from 'fs';
import path from 'path';

// Load the 5 theme files
const themeFiles = [
  { path: 'src/data/themes/cyberThemes.ts', exportName: 'CYBER_THEMES' },
  { path: 'src/data/themes/luxuryThemes.ts', exportName: 'LUXURY_THEMES' },
  { path: 'src/data/themes/saasThemes.ts', exportName: 'SAAS_THEMES' },
  { path: 'src/data/themes/brutalistThemes.ts', exportName: 'BRUTALIST_THEMES' },
  { path: 'src/data/themes/natureThemes.ts', exportName: 'NATURE_THEMES' }
];

console.log('Script initialized.');
