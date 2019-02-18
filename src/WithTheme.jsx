import React from 'react';
import types from 'prop-types';
import { connect } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Routes from './components/Routes';

/** App class that wraps higher level components of the application */
const WithTheme = (props) => {
  const { theme } = props;
  const setTheme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
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

WithTheme.propTypes = {
  theme: types.shape({
    type: types.string.isRequired,
    primary: types.shape({}).isRequired,
    secondary: types.shape({}).isRequired,
  }),
};

// react-redux export
const mapStateToProps = state => ({
  theme: state.theme,
});

export default connect(mapStateToProps)(WithTheme);
