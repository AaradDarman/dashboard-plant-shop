/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  // corePlugins: {
  //   preflight: false,
  // },
  // important: '#__next',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        Byekan: ["BYekan", ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        "instagram-gradiant": {
          background:
            "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
          "-webkit-background-clip": "text",
          "background-clip": "text",
          "-webkit-text-fill-color": "transparent",
        },
      },
      colors: {
        primary: {
          900: "#002c3b",
          800: "#134152",
          700: "#215467",
          600: "#30677d",
          500: "#3c768e",
          400: "#598aa0",
          300: "#739fb4",
          200: "#96bbcd",
          100: "#b8d8e6",
        },
        secondary: {
          dark: {
            900: "#05313f",
            800: "#194656",
            700: "#26596b",
            600: "#356d81",
            500: "#417b92",
            400: "#5d8fa4",
            300: "#77a4b7",
            200: "#99bfcf",
            100: "#b9dae7",
          },
          light: "#D6DAC9",
        },
        accent: {
          900: "#005c0e",
          800: "#007b23",
          700: "#148c2e",
          600: "#239e39",
          500: "#2cad42",
          400: "#52b95f",
          300: "#72c57b",
          200: "#9cd5a1",
          100: "#c3e5c5",
        },
        "instagram-color": "#833AB4",
        "facebook-color": "#4267B2",
        "twitter-color": "#1DA1F2",
        "linkedin-color": "#0077B5",
      },
      textColor: {
        dark: "#708075",
      },
      flexGrow: {
        0.3: 0.3,
        0.4: 0.4,
        0.5: 0.5,
        0.6: 0.6,
        0.7: 0.7,
        0.8: 0.8,
        0.9: 0.9,
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({ strategy: "base" }),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none" /* IE and Edge */,
          "scrollbar-width": "none" /* Firefox */,
        },
        ".shadow-none": {
          "box-shadow": "none",
        },
        ".border-b-solid": {
          "border-bottom-style": "solid",
        },
      });
    }),
  ],
};
