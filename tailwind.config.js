/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#2a2f3a',
        'dark-card': '#3a3f4a',
        'accent-orange': '#ff6b35',
        'accent-green': '#2ecc71',
        'text-light': '#e0e0e0',
        'text-muted': '#a0a0a0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
