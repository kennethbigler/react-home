import React, { lazy, Suspense } from 'react';
import types from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import reduce from 'lodash/reduce';
import CircularProgress from '@material-ui/core/CircularProgress';
// custom
import Header from '../common/header/Header';
import Menu from './Menu';
// Parents: Routes (Main)

// lazy load page components
const Summary = lazy(() => import('./summary'));
const Work = lazy(() => import('./work'));
const Education = lazy(() => import('./education'));
const TravelMap = lazy(() => import('./travel-map'));
const Resume = lazy(() => import('./resume'));
const GitTools = lazy(() => import('./git-tools'));
const Poker = lazy(() => import('./poker'));
const MurderMystery = lazy(() => import('./murder-mystery'));
const GraphQL = lazy(() => import('./graphql'));
const Cars = lazy(() => import('./cars'));


const Routes = (props) => {
  const { match, handleNav } = props;
  const { url } = match;

  const paths = reduce(
    [
      { name: 'work', component: Work },
      { name: 'education', component: Education },
      { name: 'travel', component: TravelMap },
      { name: 'resume', component: Resume },
      { name: 'git-tools', component: GitTools },
      { name: 'poker', component: Poker },
      { name: 'murder', component: MurderMystery },
      { name: 'graphql', component: GraphQL },
      { name: 'cars', component: Cars },
    ],
    (acc, obj) => {
      const { name, component } = obj;
      const path = `${url}${name}`;
      acc.push(<Route key={`${path}r`} exact {...{ path, component }} />);
      acc.push(<Redirect key={`${path}d`} from={`${path}*`} to={path} />);
      return acc;
    },
    [],
  );

  return (
    <div>
      <Header handleNav={handleNav}>
        <Menu />
      </Header>
      <Suspense fallback={<CircularProgress />}>
        <Switch>
          <Route component={Summary} exact path={`${url}`} />
          {paths}
          <Redirect from={`${url}*`} to={`${url}`} />
          <Route component={Summary} />
        </Switch>
      </Suspense>
    </div>
  );
};

Routes.propTypes = {
  handleNav: types.func.isRequired,
  match: types.shape({
    url: types.string.isRequired,
  }).isRequired,
};

export default Routes;
