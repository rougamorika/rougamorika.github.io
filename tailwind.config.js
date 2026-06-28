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
          red: '#FF4757',
          yellow: '#FFD700',
          'pastel-pink': '#FFB3D9',
          'pastel-purple': '#E0D4FF',
          'pastel-blue': '#B4E4FF',
        },
        bg: {
          primary: '#FFF5F7',
          secondary: '#F0E6FF',
          card: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Quicksand', 'Noto Sans JP', 'sans-serif'],
        heading: ['Noto Sans JP', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
