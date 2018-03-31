// react
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
// common
import { TIMELINE_TITLE } from '../common/timeline/Timeline';
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
// constants
import classes from '../../constants/classes';
import workExp from '../../constants/work';
// Parents: App

export default class Routes extends Component {
  static propTypes = {
    // PropTypes = [string, object, bool, number, func, array].isRequired
    handleNav: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    // set expanded state for each class
    let expanded = {};
    classes.forEach(degree => {
      expanded[degree.degree] = true;
    });
    workExp.forEach(job => {
      expanded[job.company] = true;
    });
    expanded[TIMELINE_TITLE] = true;
    this.state = { expanded };
  }

  // toggle expanded state
  handleExpand = (key, exp) => {
    let { expanded } = this.state;
    expanded[key] = exp;
    this.setState({ expanded });
  };

  render() {
    const { match, handleNav } = this.props;
    const { url } = match;
    const { expanded } = this.state;

    const education = (
      <Education onTouchTap={this.handleExpand} {...{ classes, expanded }} />
    );
    const work = (
      <Work onTouchTap={this.handleExpand} {...{ workExp, expanded }} />
    );

    const paths = [
      { name: 'work', component: () => work },
      { name: 'education', component: () => education },
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
  }
}
