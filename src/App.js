// ReactJS
import React, { Component } from 'react';
// routing
import { HashRouter } from 'react-router-dom';
// my components
import { Routes } from './components/Routes';
// material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import * as colors from 'material-ui/styles/colors';
// redux
import { configureStore, saveState } from './store/configureStore';
import { Provider } from 'react-redux';
import throttle from 'lodash/throttle';

// set state to previous or new state, and add watcher to save
const store = configureStore();
store.subscribe(throttle(() => saveState(store.getState()), 1000));

/** App class that wraps higher level components of the application */
class App extends Component {
  render() {
    const muiTheme = getMuiTheme({
      palette: {
        primary1Color: colors.indigoA700,
        primary2Color: colors.indigoA500,
        pickerHeaderColor: colors.indigoA700
      }
    });

    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={muiTheme}>
          <HashRouter>
            <Routes />
          </HashRouter>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
