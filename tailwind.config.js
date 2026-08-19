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
          blue: '#205B90',
          blueHover: '#174773',
          green: '#2DA86E',
          greenHover: '#238959',
          lightBlue: '#F0F6FB',
          dark: '#1F2937',
          actionBlue: '#3894db',
          actionBlueHover: '#2b7bb8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
