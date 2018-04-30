// react
import React from 'react';
import types from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
// common
import { Header } from '../common/Header';
import { Menu } from './Menu';
// resume
import { Summary } from './summary/Summary';
import { Work } from './work/Work';
import { Education } from './education/Education';
import { Resume } from './Resume';
import { TravelMap } from './travel-map/TravelMap';
import { GitTools } from './git-tools/GitTools';
import { PokerNight } from '../games/poker-night/PokerNight';
// Parents: App

export const Routes = props => {
  const { match, handleNav } = props;
  const { url } = match;

  const paths = [
    { name: 'work', component: Work },
    { name: 'education', component: Education },
    { name: 'travel', component: TravelMap },
    { name: 'resume', component: Resume },
    { name: 'git-tools', component: GitTools },
    { name: 'poker', component: PokerNight }
  ].reduce((acc, obj) => {
    const { name, component } = obj;
    const path = `${url}${name}`;
    acc.push(<Route key={`${path}r`} exact {...{ path, component }} />);
    acc.push(<Redirect key={`${path}d`} from={`${path}*`} to={path} />);
    return acc;
  }, []);

  return (
    <div className="resume-app">
      <Header handleNav={handleNav}>
        <Menu />
      </Header>
      <Switch>
        <Route exact path={`${url}`} component={Summary} />
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
    url: types.string.isRequired
  }).isRequired
};
