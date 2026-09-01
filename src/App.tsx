import { useMemo } from "react";
import { BrowserRouter } from "react-router";
import { CssBaseline } from "@mui/material";
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import themeAtom from "./jotai/theme-atom";
import RootRoutes from "./components/Routes";
import { useAtomValue } from "jotai";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xxl: true;
    xxxl: true;
  }
}

/** App root: theme + router around the route table */
const App = () => {
  const theme = useAtomValue(themeAtom);

  const setTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme.mode,
          primary: theme.primary,
          secondary: theme.secondary,
          contrastThreshold: 4.5, // this might have to be updated in a few years with WCAG 3.0
        },
        typography: {
          fontFamily: ["Montserrat", "sans-serif"].join(","),
        },
        breakpoints: {
          values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
            xxl: 2600,
            xxxl: 4600,
          },
        },
      }),
    [theme.mode, theme.primary, theme.secondary],
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={setTheme}>
        <CssBaseline />
        <BrowserRouter>
          <RootRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
