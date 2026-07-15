export type ThemeName = 'pastel-pink' | 'butter-yellow' | 'subtle-green' | 'pastel-purple';

export interface ThemeDefinition {
  id: ThemeName;
  label: string;
  swatch: string;
}

export const THEMES: ThemeDefinition[] = [
  { id: 'pastel-pink', label: 'Pastel Pink', swatch: '#F7D6D8' },
  { id: 'butter-yellow', label: 'Butter Yellow', swatch: '#FFF9E6' },
  { id: 'subtle-green', label: 'Subtle Green', swatch: '#E2E7DF' },
  { id: 'pastel-purple', label: 'Pastel Purple', swatch: '#E3DCEC' },
];

export const DEFAULT_THEME: ThemeName = 'pastel-pink';
