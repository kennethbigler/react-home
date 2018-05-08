// react
import React from 'react';
import types from 'prop-types';
import {Switch, Route, Redirect} from 'react-router-dom';
// common
import {Header} from '../common/Header';
import {Menu} from './Menu';
// resume
import {Summary} from './summary/';
import {Work} from './work/';
import {Education} from './education/';
import {Resume} from './resume/';
import {TravelMap} from './travel-map/';
import {GitTools} from './git-tools/';
import {PokerNight} from '../games/poker-night/';
// functions
import reduce from 'lodash/reduce';
// Parents: App

export const Routes = (props) => {
  const {match, handleNav} = props;
  const {url} = match;

  const paths = reduce(
    [
      {name: 'work', component: Work},
      {name: 'education', component: Education},
      {name: 'travel', component: TravelMap},
      {name: 'resume', component: Resume},
      {name: 'git-tools', component: GitTools},
      {name: 'poker', component: PokerNight},
    ],
    (acc, obj) => {
      const {name, component} = obj;
      const path = `${url}${name}`;
      acc.push(<Route exact key={`${path}r`} {...{path, component}} />);
      acc.push(<Redirect from={`${path}*`} key={`${path}d`} to={path} />);
      return acc;
    },
    []
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
