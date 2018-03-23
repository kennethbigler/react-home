// react
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// react router
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom';
// Routes
import ResumeRoutes from './resume/Routes';
import GameRoutes from './games/Routes';
// Parents: App

export class AppRoutes extends Component {
  static propTypes = {
    // PropTypes = [string, object, bool, number, func, array].isRequired
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  handleNav = loc => {
    const { location, history } = this.props;
    if (loc !== location.pathname) {
      history.push(loc);
    }
  };

  resume = props => <ResumeRoutes handleNav={this.handleNav} {...props} />;
  games = props => <GameRoutes handleNav={this.handleNav} {...props} />;

  render() {
    return (
      <main style={{ padding: '1em' }}>
        <Switch>
          <Route path="/games" render={this.games} />
          <Route render={this.resume} />
        </Switch>
      </main>
    );
  }
}

export const Routes = withRouter(AppRoutes);
