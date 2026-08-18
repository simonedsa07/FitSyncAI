export type ThemeName = 'bubblegum-pink' | 'cyan' | 'purple' | 'sky-blue';

export interface ThemeDefinition {
  id: ThemeName;
  label: string;
  swatch: string;
}

export const THEMES: ThemeDefinition[] = [
  { id: 'bubblegum-pink', label: 'Bubblegum Pink', swatch: '#F2679B' },
  { id: 'cyan', label: 'Cyan', swatch: '#06b6d4' },
  { id: 'purple', label: 'Purple', swatch: '#9B8CF0' },
  { id: 'sky-blue', label: 'Sky Blue', swatch: '#4A9FE8' },
];

export const DEFAULT_THEME: ThemeName = 'bubblegum-pink';
