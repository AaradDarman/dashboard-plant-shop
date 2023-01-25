import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

const Byekan = {
  fontFamily: "BYekan",
  src: `
    url(./fonts/BYekan-webfont.ttf) format('ttf')
    url(./fonts/BYekan-webfont.eot) format('eot')
    url(./fonts/BYekan-webfont.woff) format('woff')
  `,
  fontStyle: "normal",
  fontWeight: "normal",
};

export let muiLightTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  direction: "rtl",
  typography: {
    fontFamily: "BYekan",
  },
  palette: {
    mode: "light",
    primary: {
      main: "#b8d8e6",
      900: "#b8d8e6",
      800: "#96bbcd",
      700: "#739fb4",
      600: "#598aa0",
      500: "#3c768e",
      400: "#30677d",
      300: "#215467",
      200: "#134152",
      100: "#002c3b",
      contrastDefaultColor: "light",
    },
    secondary: {
      main: "#b9dae7",
      900: "#b9dae7",
      800: "#99bfcf",
      700: "#77a4b7",
      600: "#5d8fa4",
      500: "#417b92",
      400: "#356d81",
      300: "#26596b",
      200: "#194656",
      100: "#05313f",
      contrastDefaultColor: "light",
    },
    accent: {
      main: "#007b23",
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
    grey: createColor("#A9A9A9"),
    background: {
      default: "#e2e8f3",
    },
  },
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: "#db3131",
          "&$error": {
            color: "#db3131",
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "@media (min-width:425px)": {
          body: {
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              backgroundColor: "transparent",
              width: "10px",
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 0,
              backgroundColor: "#c7c7c7",
              minHeight: 24,
            },
            "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
              {
                backgroundColor: "#A9A9A9",
              },
            "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
              {
                backgroundColor: "#A9A9A9",
              },
            "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
              {
                backgroundColor: "#A9A9A9",
              },
            "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
              backgroundColor: "#2b2b2b",
            },
          },
        },
        body: {
          direction: "rtl",
          padding: 0,
          margin: 0,
          boxSizing: "border-box",
          fontFamily:
            "BYekan, -apple-system,BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,Ubuntu ,Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
          lineHeight: 1.5,
          caretColor: "#239e39",
          minHeight: "100vh",
        },
        "::-moz-selection": {
          background: "#239e39",
        },
        "::selection": {
          background: "#239e39",
        },
        a: {
          color: "inherit",
          textDecoration: "none",
        },
        button: {
          all: "unset",
        },
        "*": {
          boxSizing: "border-box",
        },
        "@global": {
          "@font-face": [Byekan],
        },
      },
    },
  },
});
muiLightTheme.typography.body1 = {
  fontSize: "1rem",
  "@media (max-width:500px)": {
    fontSize: "0.9rem",
  },
};

muiLightTheme = responsiveFontSizes(muiLightTheme);
