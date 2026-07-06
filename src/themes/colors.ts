export type ThemeName = 'soft-pink' | 'mint-green' | 'lavender' | 'sky-blue';

export interface ThemeDefinition {
  id: ThemeName;
  label: string;
  swatch: string;
}

export const THEMES: ThemeDefinition[] = [
  { id: 'soft-pink', label: 'Soft Pink', swatch: '#F6A8C8' },
  { id: 'mint-green', label: 'Mint Green', swatch: '#7FE7C4' },
  { id: 'lavender', label: 'Lavender', swatch: '#C7A9F2' },
  { id: 'sky-blue', label: 'Sky Blue', swatch: '#8FCFF7' },
];

export const DEFAULT_THEME: ThemeName = 'soft-pink';
