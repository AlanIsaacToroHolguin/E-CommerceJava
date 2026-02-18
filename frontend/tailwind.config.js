/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050505',
          900: '#0a0a0a',
          800: '#111111',
          700: '#1a1a1a',
          600: '#262626',
          500: '#404040',
          400: '#737373'
        },
        blood: {
          50:  '#fff1f1',
          100: '#ffdede',
          400: '#ff4747',
          500: '#e30613',
          600: '#c30410',
          700: '#9b020c',
          900: '#4a0006'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['"Bebas Neue"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      letterSpacing: {
        widest: '0.25em',
        ultra:  '0.4em'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(227,6,19,0.5), 0 8px 30px -8px rgba(227,6,19,0.4)'
      }
    }
  },
  plugins: []
};
