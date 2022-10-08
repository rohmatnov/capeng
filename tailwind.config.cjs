const defaultTheme = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        "icon-scale": {
          "0%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(0.8)",
          },
          "80%": {
            transform: "scale(1)",
          },
        },
      },
      animation: {
        "icon-scale": "icon-scale .2s ease-in-out",
      },
    },
  },
  plugins: [],
};
