import React from 'react';
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import WithRouter from './WithRouter';
import { DBRootState, DBUITheme } from '../store/types';

interface WithThemeProps {
  theme: DBUITheme;
}

/** App class that wraps higher level components of the application */
const WithTheme: React.FC<WithThemeProps> = (props: WithThemeProps) => {
  const { theme } = props;
  const setTheme = createMuiTheme({
    palette: {
      type: theme.type,
      primary: theme.primary,
      secondary: theme.secondary,
    },
    typography: {
      fontFamily: [
        'Montserrat',
        'sans-serif',
      ].join(','),
    },
  });

  return (
    <MuiThemeProvider theme={setTheme}>
      <CssBaseline />
      <WithRouter />
    </MuiThemeProvider>
  );
};

// react-redux export
const mapStateToProps = (state: DBRootState): WithThemeProps => ({
  theme: state.theme,
});

export default connect(mapStateToProps)(WithTheme);
