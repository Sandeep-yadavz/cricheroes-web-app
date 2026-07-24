/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cricket: {
          green: '#00D26A',
          glow: 'rgba(0, 210, 106, 0.25)',
          dark: '#0B0E14',
          card: '#121824'
        }
      }
    },
  },
  plugins: [],
}
