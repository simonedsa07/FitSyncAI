export type ThemeName = 'pastel-pink' | 'butter-yellow' | 'subtle-green' | 'pastel-purple';

export interface ThemeDefinition {
  id: ThemeName;
  label: string;
  swatch: string;
}

export const THEMES: ThemeDefinition[] = [
  { id: 'pastel-pink', label: 'Sunset Coral', swatch: '#E8734A' },
  { id: 'butter-yellow', label: 'Dreamy Lavender', swatch: '#9B8CF0' },
  { id: 'subtle-green', label: 'Mint Spark', swatch: '#2BB893' },
  { id: 'pastel-purple', label: 'Sky Focus', swatch: '#4A9FE8' },
];

export const DEFAULT_THEME: ThemeName = 'pastel-pink';
