import React from 'react';
import { HashRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import throttle from 'lodash/throttle';
import { configureStore, saveState } from './store/configureStore';
import Routes from './components/Routes';

// set state to previous or new state, and add watcher to save
const store = configureStore();
store.subscribe(throttle(() => saveState(store.getState()), 1000));

const { type, primary, secondary } = store.getState().theme;

/** App class that wraps higher level components of the application */
const App = () => {
  const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      type: type || 'dark',
      primary,
      secondary,
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
