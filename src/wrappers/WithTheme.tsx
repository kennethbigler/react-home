import * as React from "react";
import { useRecoilState } from "recoil";
import CssBaseline from "@mui/material/CssBaseline";
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import themeAtom from "../recoil/theme-atom";
import WithRouter from "./WithRouter";

/** App class that wraps higher level components of the application */
const WithTheme: React.FC = () => {
  const [theme] = useRecoilState(themeAtom);

  const setTheme = createTheme({
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
  });

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
