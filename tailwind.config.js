/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        anime: {
          pink: '#FF6B9D',
          purple: '#C6A7FF',
          blue: '#89CFF0',
          yellow: '#FFD700',
          'pastel-pink': '#FFB3D9',
          'pastel-purple': '#E0D4FF',
          'pastel-blue': '#B4E4FF',
        },
        bg: {
          primary: '#FFF5F7',
          secondary: '#F0E6FF',
          card: 'rgba(255, 255, 255, 0.9)',
        },
      },
      fontFamily: {
        sans: ['Quicksand', 'Noto Sans JP', 'sans-serif'],
        heading: ['Noto Sans JP', 'sans-serif'],
      },
      boxShadow: {
        'anime-glow': '0 0 20px rgba(255, 107, 157, 0.3)',
        'anime-hover': '0 4px 12px rgba(255, 107, 157, 0.3)',
      },
      animation: {
        'sparkle': 'sparkle 2s infinite',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
