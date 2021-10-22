import React from 'react';
import { useSelector } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import {
  ThemeProvider, StyledEngineProvider, createTheme,
} from '@mui/material/styles';
import WithRouter from './WithRouter';
import { DBRootState } from '../store/types';

/** App class that wraps higher level components of the application */
const WithTheme: React.FC = () => {
  const theme = useSelector((state: DBRootState) => state.theme);

  const setTheme = createTheme({
    palette: {
      mode: theme.mode,
      primary: theme.primary,
      secondary: theme.secondary,
    },
    typography: {
      fontFamily: ['Montserrat', 'sans-serif'].join(','),
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
