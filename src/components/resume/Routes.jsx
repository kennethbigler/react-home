import React, { Suspense } from 'react';
import types from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import reduce from 'lodash/reduce';
// custom
import lazyWithPreload from '../../apis/lazyWithPreload';
import Header from '../common/header/Header';
import Menu from './Menu';
import LoadingSpinner from '../common/LoadingSpinner';
// Parents: Routes (Main)

// lazy load page components
const Summary = lazyWithPreload(import('./summary'));
const Work = lazyWithPreload(import('./work'));
const Education = lazyWithPreload(import('./education'));
const TravelMap = lazyWithPreload(import('./travel-map'));
const Resume = lazyWithPreload(import('./resume'));
const GitTools = lazyWithPreload(import('./git-tools'));
const Poker = lazyWithPreload(import('./poker'));
const MurderMystery = lazyWithPreload(import('./murder-mystery'));
const GraphQL = lazyWithPreload(import('./graphql'));
const Cars = lazyWithPreload(import('./cars'));

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
      <Suspense fallback={<LoadingSpinner />}>
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
