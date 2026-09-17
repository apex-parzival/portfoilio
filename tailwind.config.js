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
        // Contrast-checked against #0a0a0a. Prefer these over stacking opacity
        // on `foreground`, which bottoms out near 1.4:1.
        muted: '#8a8a8a',   // 5.73:1 — secondary body text (WCAG AA)
        faint: '#6b6b6b',   // 3.72:1 — decorative only (row numbers)
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
