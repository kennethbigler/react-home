import React from 'react';
import {
  Switch, Route, withRouter, RouteComponentProps,
} from 'react-router-dom';
import LoadingSpinner from './common/loading-spinner';

// lazy load sub routers
const ResumeRoutes = React.lazy(() => import(/* webpackChunkName: "resume" */ './resume/Routes'));
const GameRoutes = React.lazy(() => import(/* webpackChunkName: "games" */ './games/Routes'));

const Routes: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const { location: { pathname }, history } = props;

  const handleNav = React.useCallback((loc: string): void => {
    if (loc !== pathname) {
      history.push(loc);
    }
  }, [history, pathname]);

  const resume = React.useCallback(
    (props: RouteComponentProps): React.ReactNode => <ResumeRoutes handleNav={handleNav} {...props} />,
    [handleNav],
  );
  const games = React.useCallback(
    (props: RouteComponentProps): React.ReactNode => <GameRoutes handleNav={handleNav} {...props} />,
    [handleNav],
  );

  return (
    <main style={{ padding: '1em', paddingTop: '5em' }}>
      <React.Suspense fallback={<LoadingSpinner />}>
        <Switch>
          <Route path="/games" render={games} />
          <Route render={resume} />
        </Switch>
      </React.Suspense>
    </main>
  );
};

export default withRouter(Routes);
