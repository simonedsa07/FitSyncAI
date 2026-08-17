import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--text-main)',
        paper: '#FFFFFF',
        muted: 'var(--text-muted)',
        accent: 'var(--accent)',
        'accent-light': 'var(--accent-light)',
        'accent-dark': 'var(--accent-dark)',
        page: 'var(--page-bg)',
        coral: '#E8734A',
        lavender: '#9B8CF0',
        mint: '#2BB893',
        blue: '#4A9FE8',
        pink: '#F2679B',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        xl2: '12px',
        card: '16px',
      },
      boxShadow: {
        brutal: '5px 5px 0px 0px rgba(17,17,17,1)',
        'brutal-sm': '3px 3px 0px 0px rgba(17,17,17,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(17,17,17,1)',
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        popIn: 'popIn 0.15s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;