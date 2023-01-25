import "styles/globals.css";
import "styles/nprogress.min.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import { ThemeProvider } from "next-themes";
import {
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { ThemeProvider as StyledComponentThemeProvider } from "styled-components";
import { CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import { muiLightTheme } from "styles/themes/mui-light-theme";
import { muiDarkTheme } from "styles/themes/mui-dark-theme";
import { useDarkMode } from "utils/useDarkMode";
import createEmotionCache from "utils/createEmotionCache";
import AppContext from "context/AppContext";
import RTL from "components/RTL";
import store from "redux/store";
import { Provider } from "react-redux";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import { saveState } from "utils/browser-storage";
import Router from "next/router";
import { ToastContainer } from "react-toastify";
import NProgress from "nprogress";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

const clientSideEmotionCache = createEmotionCache();

NProgress.configure({ showSpinner: false });

Router.onRouteChangeStart = (url) => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => NProgress.done();

Router.onRouteChangeError = () => NProgress.done();

function MyApp({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}) {
  const [theme, toggleTheme, componentMounted] = useDarkMode();
  const getLayout = Component.getLayout || ((page) => page);

  store.subscribe(
    debounce(() => {
      if (isEmpty(store.getState().user?.user)) {
        saveState(store.getState().cart);
      }
    }, 800)
  );

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <StyledEngineProvider injectFirst>
        <MuiThemeProvider
          theme={theme === "light" ? muiLightTheme : muiDarkTheme}
        >
          <ThemeProvider
            defaultTheme="dark"
            enableSystem={false}
            attribute="class"
          >
            <StyledComponentThemeProvider
              theme={theme === "light" ? muiLightTheme : muiDarkTheme}
            >
              <RTL>
                <Provider store={store}>
                  <ToastContainer theme="dark" />
                  <CssBaseline />
                  <AppContext toggleTheme={toggleTheme}>
                    {getLayout(<Component {...pageProps} />)}
                  </AppContext>
                </Provider>
              </RTL>
            </StyledComponentThemeProvider>
          </ThemeProvider>
        </MuiThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  );
}

export default MyApp;
