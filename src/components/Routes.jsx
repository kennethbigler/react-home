import React, { Component, Suspense, lazy } from 'react';
import types from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import LoadingSpinner from './common/loading-spinner';
// Parents: WithTheme

// lazy load sub routers
const ResumeRoutes = lazy(() => import(/* webpackChunkName: "resume" */ './resume/Routes'));
const GameRoutes = lazy(() => import(/* webpackChunkName: "games" */ './games/Routes'));

class Routes extends Component {
  handleNav = (loc) => {
    const { location, history } = this.props;
    if (loc !== location.pathname) {
      history.push(loc);
    }
  };

  resume = (props) => <ResumeRoutes handleNav={this.handleNav} {...props} />;

  games = (props) => <GameRoutes handleNav={this.handleNav} {...props} />;

  render() {
    return (
      <main style={{ padding: '1em', paddingTop: '5em' }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Switch>
            <Route path="/games" render={this.games} />
            <Route render={this.resume} />
          </Switch>
        </Suspense>
      </main>
    );
  }
}

Routes.propTypes = {
  history: types.shape({
    push: types.func.isRequired,
  }).isRequired,
  location: types.shape({ pathname: types.string.isRequired }).isRequired,
};

export default withRouter(Routes);
