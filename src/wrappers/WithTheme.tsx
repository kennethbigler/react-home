import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import { useAppSelector } from "../store/store";
import WithRouter from "./WithRouter";

/** App class that wraps higher level components of the application */
const WithTheme: React.FC = () => {
  const theme = useAppSelector((state) => state.theme);

  const setTheme = createTheme({
    palette: {
      mode: theme.mode,
      primary: theme.primary,
      secondary: theme.secondary,
    },
    typography: {
      fontFamily: ["Montserrat", "sans-serif"].join(","),
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
