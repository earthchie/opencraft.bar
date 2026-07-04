// OG Image Theme Palette System
// Maps site themes to color palettes for OG image generation

export type OgThemeName = 'dark' | 'wheat' | 'lager' | 'ipa';

export interface OgPalette {
  bg: string;
  accent: string;
  accentLight: string;
  text: string;
  textMuted: string;
  pillBg: string;
  pillBorder: string;
}

export const VALID_OG_THEMES: OgThemeName[] = ['dark', 'wheat', 'lager', 'ipa'];

const palettes: Record<OgThemeName, OgPalette> = {
  dark: {
    bg: '#0a0a0a',
    accent: '#c8934f',
    accentLight: '#d4a76a',
    text: '#e0e0e0',
    textMuted: '#a0a0a0',
    pillBg: 'rgba(200,147,79,0.15)',
    pillBorder: 'rgba(200,147,79,0.3)',
  },
  wheat: {
    bg: '#f4ecd8',
    accent: '#c8934f',
    accentLight: '#d4a76a',
    text: '#5b4636',
    textMuted: '#8b7b6b',
    pillBg: 'rgba(200,147,79,0.15)',
    pillBorder: 'rgba(200,147,79,0.3)',
  },
  lager: {
    bg: '#fdfaf2',
    accent: '#c8934f',
    accentLight: '#d4a76a',
    text: '#3a2010',
    textMuted: '#8b7040',
    pillBg: 'rgba(200,147,79,0.15)',
    pillBorder: 'rgba(200,147,79,0.3)',
  },
  ipa: {
    bg: '#1a1008',
    accent: '#c8934f',
    accentLight: '#d4a76a',
    text: '#e0d5c8',
    textMuted: '#a89888',
    pillBg: 'rgba(200,147,79,0.15)',
    pillBorder: 'rgba(200,147,79,0.3)',
  },
};

export function getOgPalette(theme: string = 'dark'): OgPalette {
  const key = (VALID_OG_THEMES.includes(theme as OgThemeName) ? theme : 'dark') as OgThemeName;
  return palettes[key];
}
