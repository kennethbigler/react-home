// ReactJS
import React, {Component, Fragment} from 'react';
// routing
import {HashRouter} from 'react-router-dom';
// my components
import {Routes} from './components/Routes';
// material UI
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import * as colors from 'material-ui/styles/colors';
// redux
import {configureStore, saveState} from './store/configureStore';
import {Provider} from 'react-redux';
import throttle from 'lodash/throttle';

// set state to previous or new state, and add watcher to save
const store = configureStore();
store.subscribe(throttle(() => saveState(store.getState()), 1000));

/** App class that wraps higher level components of the application */
class App extends Component {
  render() {
    const theme = getMuiTheme({
      palette: {
        primary1Color: colors.blueGrey600,
        primary2Color: colors.indigoA500,
        pickerHeaderColor: colors.indigoA700,
      },
    });

    return (
      <Provider store={store}>
        <Fragment>
          <CssBaseline />
          <MuiThemeProvider muiTheme={theme}>
            <HashRouter>
              <Routes />
            </HashRouter>
          </MuiThemeProvider>
        </Fragment>
      </Provider>
    );
  }
}

export default App;
