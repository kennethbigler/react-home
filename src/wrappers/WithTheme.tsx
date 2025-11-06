import { useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import themeAtom from "../jotai/theme-atom";
import WithRouter from "./WithRouter";
import { useAtomValue } from "jotai";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xxl: true;
    xxxl: true;
  }
}

/** App class that wraps higher level components of the application */
const WithTheme = () => {
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
        <WithRouter />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default WithTheme;
