/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: {
        100: "#f9d3d1",
        200: "#f3a7a3",
        300: "#ee7b76",
        400: "#e84f48",
        500: "#e2231a",
        600: "#b51c15",
        700: "#881510",
        800: "#5a0e0a",
        900: "#2d0705"
      },
      secondary: '#6c757d',
      success: {
        100: "#d4edda",
        200: "#a9dcb5",
        300: "#7eca8f",
        400: "#53b96a",
        500: "#28a745",
        600: "#208637",
        700: "#186429",
        800: "#10431c",
        900: "#08210e"
      },
      info: {
        100: "#d1ecf1",
        200: "#a2dae3",
        300: "#74c7d4",
        400: "#45b5c6",
        500: "#17a2b8",
        600: "#128293",
        700: "#0e616e",
        800: "#09414a",
        900: "#052025"
      },
      warning: '#fd7e14',
      danger: '#dc3545',
      light: '#f8f9fa',
      dark: '#343a40',
      bg: '#ffffff',
      white: '#ffffff',
    },
    extend: {},
  },
  plugins: [],
}