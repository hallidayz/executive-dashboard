/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#0B0D12',
          900: '#11141D',
          850: '#161B27',
          800: '#1E2433',
          700: '#2A3246',
          600: '#3D4862',
        },
        gold: {
          400: '#FCD34D',
          500: '#F59E0B',
          600: '#D97706',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
        },
        indigo: {
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.4)',
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
      }
    },
  },
  plugins: [],
}
