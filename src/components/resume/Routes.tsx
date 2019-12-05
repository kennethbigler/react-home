import React from 'react';
import {
  Switch, Route, Redirect, match as Match,
} from 'react-router-dom';
import lazyWithPreload from '../../helpers/lazyWithPreload';
import Header from '../common/header/Header';
import Menu from './Menu';
import LoadingSpinner from '../common/loading-spinner';

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

interface RoutesProps {
  handleNav: Function;
  match: Match;
}

const Routes: React.FC<RoutesProps> = (props: RoutesProps) => {
  const { match: { url }, handleNav } = props;

  const paths = React.useMemo(() => [
    { name: 'work', component: Work },
    { name: 'education', component: Education },
    { name: 'travel', component: TravelMap },
    { name: 'resume', component: Resume },
    { name: 'git-tools', component: GitTools },
    { name: 'poker', component: Poker },
    { name: 'murder', component: MurderMystery },
    { name: 'graphql', component: GraphQL },
    { name: 'cars', component: Cars },
  ].reduce((acc: React.ReactNodeArray, obj) => {
    const { name, component } = obj;
    const path = `${url}${name}`;
    acc.push(<Route key={`${path}r`} exact {...{ path, component }} />);
    acc.push(<Redirect key={`${path}d`} from={`${path}*`} to={path} />);
    return acc;
  },
  []), [url]);

  return (
    <>
      <Header handleNav={handleNav}>
        <Menu />
      </Header>
      <React.Suspense fallback={<LoadingSpinner />}>
        <Switch>
          <Route component={Summary} exact path={`${url}`} />
          {paths}
          <Redirect from={`${url}*`} to={`${url}`} />
          <Route component={Summary} />
        </Switch>
      </React.Suspense>
    </>
  );
};

export default Routes;
