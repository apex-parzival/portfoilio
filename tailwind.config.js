/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#0a0a0a',
        foreground: '#ededed',
        cream: '#C4A882',
        accent: '#FF4D00',
        muted: '#666666',
        'surface': '#141414',
        'surface-light': '#1a1a1a',
      },
      spacing: {
        'section': '8rem',
      }
    },
  },
  plugins: [],
}
