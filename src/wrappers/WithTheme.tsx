import React from 'react';
import { useSelector } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import WithRouter from './WithRouter';
import { DBRootState } from '../store/types';

/** App class that wraps higher level components of the application */
const WithTheme: React.FC<{}> = () => {
  const theme = useSelector((state: DBRootState) => state.theme);

  const setTheme = createMuiTheme({
    palette: {
      type: theme.type,
      primary: theme.primary,
      secondary: theme.secondary,
    },
    typography: {
      fontFamily: ['Montserrat', 'sans-serif'].join(','),
    },
  });

  return (
    <MuiThemeProvider theme={setTheme}>
      <CssBaseline />
      <WithRouter />
    </MuiThemeProvider>
  );
};

export default WithTheme;
