import React, { Suspense, lazy } from 'react';
import {
  Switch, Route, withRouter, RouteComponentProps,
} from 'react-router-dom';
import { StaticContext } from 'react-router';
import LoadingSpinner from './common/loading-spinner';

type RoutesProps = RouteComponentProps<any, StaticContext, any>;

// lazy load sub routers
const ResumeRoutes = lazy(() => import(/* webpackChunkName: "resume" */ './resume/Routes'));
const GameRoutes = lazy(() => import(/* webpackChunkName: "games" */ './games/Routes'));

const Routes: React.FC<RoutesProps> = (props: RoutesProps) => {
  const handleNav = (loc: string): void => {
    const { location, history } = props;
    if (loc !== location.pathname) {
      history.push(loc);
    }
  };

  const resume = (passProps: RoutesProps): React.ReactNode => <ResumeRoutes handleNav={handleNav} {...passProps} />;

  const games = (passProps: RoutesProps): React.ReactNode => <GameRoutes handleNav={handleNav} {...passProps} />;

  return (
    <main style={{ padding: '1em', paddingTop: '5em' }}>
      <Suspense fallback={<LoadingSpinner />}>
        <Switch>
          <Route path="/games" render={games} />
          <Route render={resume} />
        </Switch>
      </Suspense>
    </main>
  );
};

export default withRouter(Routes);
