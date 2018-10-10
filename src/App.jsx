// ReactJS
import React from 'react';
// routing
import { HashRouter } from 'react-router-dom';
// my components
// material UI
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import deepOrange from '@material-ui/core/colors/deepOrange';
// redux
import { Provider } from 'react-redux';
import throttle from 'lodash/throttle';
import { configureStore, saveState } from './store/configureStore';
import Routes from './components/Routes';

// set state to previous or new state, and add watcher to save
const store = configureStore();
store.subscribe(throttle(() => saveState(store.getState()), 1000));

/** App class that wraps higher level components of the application */
const App = () => {
  const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: blueGrey,
      secondary: deepOrange,
    },
  });

  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <HashRouter>
          <Routes />
        </HashRouter>
      </MuiThemeProvider>
    </Provider>
  );
};

export default App;
