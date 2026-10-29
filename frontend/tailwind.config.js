/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#071009',
          900: '#0B160E',
          850: '#0F1E13',
          800: '#14271A',
          700: '#1A3523',
        },
        botanical: {
          600: '#1D6F39',
          500: '#268748',
          400: '#34A85C',
          300: '#52C67B',
        },
        sage: {
          100: '#E7EFE9',
          200: '#CFE0D3',
          300: '#B0CAB6',
          400: '#8FAFA6',
          500: '#6E8F7A',
        },
        pulp: {
          50: '#F4FAF5',
          100: '#E9F5EC',
          200: '#D5ECE0',
        },
        ivory: {
          50: '#FAF8F4',
          100: '#F5F1E9',
          200: '#EBE5D9',
        }
      },
      fontFamily: {
        editorial: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' }
        }
      },
      animation: {
        'scanner': 'scan 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}
