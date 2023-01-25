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

export let muiDarkTheme = createTheme({
  breakpoints: {
    values: {
      xs: 639,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  direction: "rtl",
  typography: {
    fontFamily: "BYekan",
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#002c3b",
      900: "#002c3b",
      800: "#134152",
      700: "#215467",
      600: "#30677d",
      500: "#3c768e",
      400: "#598aa0",
      300: "#739fb4",
      200: "#96bbcd",
      100: "#b8d8e6",
      contrastDefaultColor: "light",
    },
    secondary: {
      main: "#05313f",
      900: "#05313f",
      800: "#194656",
      700: "#26596b",
      600: "#356d81",
      500: "#417b92",
      400: "#5d8fa4",
      300: "#77a4b7",
      200: "#99bfcf",
      100: "#b9dae7",
      contrastDefaultColor: "light",
    },
    accent: {
      main: "#2cad42",
      900: "#2cad42",
      800: "#41b555",
      700: "#56bd68",
      600: "#6bc67b",
      500: "#80ce8e",
      400: "#96d6a1",
      300: "#abdeb3",
      200: "#c0e6c6",
      100: "#d5efd9",
    },
    grey: createColor("#bdbdbd"),
    background: {
      default: "#141921",
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
              backgroundColor: "#001f29",
              width: "10px",
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 5,
              backgroundColor: "#134152",
              minHeight: 24,
            },
            "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
              {
                backgroundColor: "#215467",
              },
            "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
              {
                backgroundColor: "#215467",
              },
            "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
              {
                backgroundColor: "#215467",
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
          caretColor: "#2cad42",
          minHeight: "100vh",
        },
        "::-moz-selection": {
          background: "#2cad42",
        },
        "::selection": {
          background: "#2cad42",
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
muiDarkTheme.typography.body1 = {
  fontSize: "1rem",
  "@media (max-width:500px)": {
    fontSize: "0.9rem",
  },
};

muiDarkTheme = responsiveFontSizes(muiDarkTheme);
