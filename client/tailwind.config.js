/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d8ff',
          300: '#a4bcfd',
          400: '#8097fb',
          500: '#6172f5',
          600: '#4f53ea',
          700: '#4240d0',
          800: '#3636a8',
          900: '#303285',
          950: '#1e1d52',
        },
        surface: {
          50: '#f8f9fb',
          100: '#f0f2f7',
          200: '#e4e8f2',
          300: '#cdd4e5',
          400: '#a8b4ce',
          500: '#8594b4',
          600: '#6b789a',
          700: '#57627e',
          800: '#495268',
          900: '#3f4657',
          950: '#1a1d2e',
        },
        dark: {
          bg: '#0d0f1a',
          card: '#13162a',
          border: '#1e2340',
          hover: '#1a1e35',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.4)',
        'brand': '0 4px 14px rgba(97, 114, 245, 0.4)',
        'brand-lg': '0 8px 24px rgba(97, 114, 245, 0.35)',
        'glow': '0 0 20px rgba(97, 114, 245, 0.3)',
      },
    },
  },
  plugins: [],
}