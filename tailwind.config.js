/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#008F83',
          blueHover: '#00756C',
          green: '#16A66A',
          greenHover: '#118653',
          lightBlue: '#EEF6FB',
          dark: '#14212B',
          actionBlue: '#2684C6',
          actionBlueHover: '#1C6EA8',
          deep: '#0B2533',
          navy: '#123847',
          mint: '#E8F4F3',
          border: '#DCE7EA',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Nunito Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
