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
        background: '#07071A',
        surface: 'rgba(16, 10, 40, 0.75)',
        'surface-hover': 'rgba(28, 18, 65, 0.85)',
        border: 'rgba(120, 80, 255, 0.22)',
        primary: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        accent: {
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
        },
        cyan: {
          400: '#38BDF8',
          500: '#0EA5E9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 20px -3px rgba(124, 58, 237, 0.35)',
        'glow-md': '0 0 35px -5px rgba(124, 58, 237, 0.5)',
        'glow-lg': '0 0 60px -5px rgba(139, 92, 246, 0.45)',
        'devmate-card': '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 80px rgba(88, 40, 200, 0.2)',
      }
    },
  },
  plugins: [],
}
