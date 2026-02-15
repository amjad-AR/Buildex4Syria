/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
        'tajawal': ['Tajawal', 'sans-serif'],
      },
      colors: {
        // Buildex Brand Colors
        'primary': {
          DEFAULT: '#022d37',
          light: '#064350',
          dark: '#011a20',
        },
        'secondary': {
          DEFAULT: '#ffedd8',
          light: '#fff5eb',
          dark: '#f5dfc5',
        },
        'accent': {
          DEFAULT: '#084C5C',
          light: '#0a6275',
          dark: '#063a47',
        },
        // Legacy lumina colors for compatibility
        'lumina': {
          50: '#e6f3f5',
          100: '#cce7eb',
          200: '#99cfd7',
          300: '#66b7c3',
          400: '#339faf',
          500: '#084C5C',
          600: '#063d4a',
          700: '#052e38',
          800: '#031f26',
          900: '#022d37',
          950: '#011a20',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(8, 76, 92, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(8, 76, 92, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'buildex': '0 4px 20px rgba(2, 45, 55, 0.15)',
        'buildex-lg': '0 8px 30px rgba(2, 45, 55, 0.2)',
        'accent': '0 4px 15px rgba(8, 76, 92, 0.4)',
      }
    },
  },
  plugins: [],
}
