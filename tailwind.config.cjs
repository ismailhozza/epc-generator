/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: '#e2231a',
      secondary: '#6c757d',
      success: '#28a745',
      info: '#17a2b8',
      warning: '#fd7e14',
      danger: '#dc3545',
      light: '#f8f9fa',
      dark: '#343a40',
      bg: '#ffffff',
    },
    extend: {},
  },
  plugins: [],
}