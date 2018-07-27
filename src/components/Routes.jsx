// react
import React, { Component } from 'react';
import types from 'prop-types';
// react router
import { Switch, Route, withRouter } from 'react-router-dom';
// Routes
import ResumeRoutes from './resume/Routes';
import GameRoutes from './games/Routes';
// Parents: App

export class Routes extends Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    history: types.shape({
      push: types.func.isRequired,
    }).isRequired,
    location: types.shape({ pathname: types.string.isRequired }).isRequired,
  };

  handleNav = (loc) => {
    const { location, history } = this.props;
    if (loc !== location.pathname) {
      history.push(loc);
    }
  };

  resume = props => <ResumeRoutes handleNav={this.handleNav} {...props} />;

  games = props => <GameRoutes handleNav={this.handleNav} {...props} />;

  render() {
    return (
      <main style={{ padding: '1em', paddingTop: '5em' }}>
        <Switch>
          <Route path="/games" render={this.games} />
          <Route render={this.resume} />
        </Switch>
      </main>
    );
  }
}

export default withRouter(Routes);
