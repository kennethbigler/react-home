// ReactJS
import React, { Component } from 'react';
// routing
import { HashRouter } from 'react-router-dom';
// my components
import { Header } from './components/Header';
import { Main } from './components/Main';
// material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import * as colors from 'material-ui/styles/colors';
// redux
import configureStore from './modules/configureStore';
import initialState from './modules/initialState';
import { Provider } from 'react-redux';

// you can pass an initial state into here if you would like
const store = configureStore(initialState);

class App extends Component {
  render() {
    const muiTheme = getMuiTheme({
      palette: {
        primary1Color: colors.indigoA700,
        primary2Color: colors.indigoA500,
        accent1Color: colors.yellow200,
        pickerHeaderColor: colors.indigoA700
      }
    });

    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={muiTheme}>
          <HashRouter>
            <div className="App">
              <Header />
              <Main />
            </div>
          </HashRouter>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
