import React, { Component } from "react";
import { HashRouter } from "react-router-dom";
import Header from "./components/Header";
import Main from "./components/Main";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import * as colors from "material-ui/styles/colors";

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
      <MuiThemeProvider muiTheme={muiTheme}>
        <HashRouter>
          <div className="App">
            <Header />
            <Main />
          </div>
        </HashRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
