/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.vue',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          contrast: '#00cef8',
          DEFAULT: '#ff1043',
          light: '#F5F1ED',
          gray: '#636466',
          dark: '#090B13'
        }
      },
    },
  },
  plugins: [],
}

