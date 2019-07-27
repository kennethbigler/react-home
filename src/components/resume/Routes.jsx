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
const Summary = lazyWithPreload(import(/* webpackChunkName: "r_summary" */ './summary'));
const Work = lazyWithPreload(import(/* webpackChunkName: "r_work" */ './work'));
const Education = lazyWithPreload(import(/* webpackChunkName: "r_education" */ './education'));
const TravelMap = lazyWithPreload(import(/* webpackChunkName: "r_travel" */ './travel-map'));
const Resume = lazyWithPreload(import(/* webpackChunkName: "r_resume" */ './resume'));
const GitTools = lazyWithPreload(import(/* webpackChunkName: "r_git" */ './git-tools'));
const Poker = lazyWithPreload(import(/* webpackChunkName: "r_poker" */ './poker'));
const MurderMystery = lazyWithPreload(import(/* webpackChunkName: "r_poker" */ './murder-mystery'));
const GraphQL = lazyWithPreload(import(/* webpackChunkName: "r_graphql" */ './graphql'));
const Cars = lazyWithPreload(import(/* webpackChunkName: "r_cars" */ './cars'));

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
