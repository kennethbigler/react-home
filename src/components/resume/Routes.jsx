// react
import React from 'react';
import types from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
// functions
import reduce from 'lodash/reduce';
// common
import Header from '../common/header/Header';
import Menu from './Menu';
// resume
import Summary from './summary';
import Work from './work';
import Education from './education';
import Resume from './resume';
import TravelMap from './travel-map';
import GitTools from './git-tools';
import MurderMystery from './murder-mystery';
import Poker from './poker';
import GraphQL from './graphql';
import Cars from './cars';
// Parents: App

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
    <div className="resume-app">
      <Header handleNav={handleNav}>
        <Menu />
      </Header>
      <Switch>
        <Route component={Summary} exact path={`${url}`} />
        {paths}
        <Redirect from={`${url}*`} to={`${url}`} />
        <Route component={Summary} />
      </Switch>
    </div>
  );
};

Routes.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  handleNav: types.func.isRequired,
  match: types.shape({
    url: types.string.isRequired,
  }).isRequired,
};

export default Routes;
