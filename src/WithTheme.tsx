import React from 'react';
import { connect } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Routes from './components/Routes';
import { DBRootState, DBUITheme } from './store/types';

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
  });

  return (
    <MuiThemeProvider theme={setTheme}>
      <CssBaseline />
      <HashRouter>
        <Routes />
      </HashRouter>
    </MuiThemeProvider>
  );
};

// react-redux export
const mapStateToProps = (state: DBRootState): WithThemeProps => ({
  theme: state.theme,
});

export default connect(mapStateToProps)(WithTheme);
