import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:      'var(--bg)',
        surface: 'var(--surface)',
        card:    'var(--card)',
        border:  'var(--border)',
        orange:  'var(--orange)',
        orange2: 'var(--orange2)',
        green:   'var(--green)',
        blue:    'var(--blue)',
        purple:  'var(--purple)',
        text:    'var(--text)',
        muted:   'var(--muted)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
        'float':      'float 3s ease-in-out infinite',
        'flame':      'streak-flame 0.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
