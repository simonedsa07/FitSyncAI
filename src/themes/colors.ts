export type ThemeName = 'pale-plum' | 'soft-peach' | 'muted-sage' | 'warm-cream' | 'blush-pink';

export interface ThemeDefinition {
  id: ThemeName;
  label: string;
  swatch: string;
}

export const THEMES: ThemeDefinition[] = [
  { id: 'blush-pink', label: 'Blush Pink', swatch: '#FBC4CB' },
  { id: 'pale-plum', label: 'Pale Plum', swatch: '#E0BBE4' },
  { id: 'soft-peach', label: 'Soft Peach', swatch: '#FFDFD3' },
  { id: 'muted-sage', label: 'Muted Sage', swatch: '#DCEEE2' },
  { id: 'warm-cream', label: 'Warm Cream', swatch: '#FDF6ED' },
];

export const DEFAULT_THEME: ThemeName = 'blush-pink';
