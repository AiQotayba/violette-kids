/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tajawal_400Regular'],
        bold: ['Tajawal_700Bold'],
        extralight: ['Tajawal_200ExtraLight'],
        light: ['Tajawal_300Light'],
        regular: ['Tajawal_400Regular'],
        medium: ['Tajawal_500Medium'],
        extrabold: ['Tajawal_800ExtraBold'],
        black: ['Tajawal_900Black'],
        numeric: ['Tajawal_500Medium'],
      },
    },
  },
  plugins: [],
};
