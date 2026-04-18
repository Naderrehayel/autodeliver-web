/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#E1F5EE',
          100: '#9FE1CB',
          200: '#5DCAA5',
          400: '#1D9E75',
          600: '#0F6E56',
          800: '#085041',
          900: '#04342C',
        },
        ink: {
          50:  '#F5F4F0',
          100: '#E8E7E2',
          200: '#C8C7C0',
          400: '#8A8880',
          600: '#5A5954',
          800: '#2C2C28',
          900: '#161614',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body:    ['var(--font-body)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-left': 'slideLeft 0.5s ease forwards',
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow':  'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: 0 },                                 to: { opacity: 1 } },
        slideLeft: { from: { opacity: 0, transform: 'translateX(32px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        float:     { '0%,100%': { transform: 'translateY(0px)' },         '50%': { transform: 'translateY(-12px)' } },
      },
      backgroundImage: {
        'grid-ink':    'linear-gradient(rgba(44,44,40,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(44,44,40,.04) 1px, transparent 1px)',
        'noise':       "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
