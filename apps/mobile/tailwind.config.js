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
        heading: ['Tajawal_700Bold'],
        numeric: ['Tajawal_500Medium'],
      },
    },
  },
  plugins: [],
};
