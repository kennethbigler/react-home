import React from 'react';
import {
  Switch, Route, withRouter, RouteComponentProps,
} from 'react-router-dom';
import LoadingSpinner from './common/loading-spinner';

type RoutesProps = RouteComponentProps<{ url: string }>;

// lazy load sub routers
const ResumeRoutes = React.lazy(() => import(/* webpackChunkName: "resume" */ './resume/Routes'));
const GameRoutes = React.lazy(() => import(/* webpackChunkName: "games" */ './games/Routes'));

const Routes: React.FC<RoutesProps> = (props: RoutesProps) => {
  const { location: { pathname }, history } = props;

  const handleNav = React.useCallback((loc: string): void => {
    if (loc !== pathname) {
      history.push(loc);
    }
  }, [history, pathname]);

  const resume = React.useCallback(
    (passProps: RoutesProps): React.ReactNode => <ResumeRoutes handleNav={handleNav} {...passProps} />,
    [handleNav],
  );
  const games = React.useCallback(
    (passProps: RoutesProps): React.ReactNode => <GameRoutes handleNav={handleNav} {...passProps} />,
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
