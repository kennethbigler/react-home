// react
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
// common
import { TIMELINE_TITLE } from '../common/timeline/Timeline';
// resume
import { Home } from './Home';
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

export class ResumeRoutes extends Component {
  static propTypes = {
    // PropTypes = [string, object, bool, number, func, array].isRequired
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
  handleExpandChange = (key, exp) => {
    let { expanded } = this.state;
    expanded[key] = exp;
    this.setState({ expanded });
  };

  render() {
    const { url } = this.props.match;
    const { expanded } = this.state;
    const education = (
      <Education
        onTouchTap={this.handleExpandChange}
        classes={classes}
        expanded={expanded}
      />
    );
    const work = (
      <Work
        onTouchTap={this.handleExpandChange}
        workExp={workExp}
        expanded={expanded}
      />
    );

    const urls = [
      { name: 'work', component: () => work },
      { name: 'education', component: () => education },
      { name: 'travel', component: TravelMap },
      { name: 'resume', component: Resume },
      { name: 'git-tools', component: GitTools },
      { name: 'poker', component: PokerNight }
    ];

    let paths = [];

    urls.forEach(obj => {
      const { name, component } = obj;
      const path = `${url}${name}`;
      paths.push(<Route key={`${path}r`} exact {...{ path, component }} />);
      paths.push(<Redirect key={`${path}d`} from={`${path}*`} to={path} />);
    });

    return (
      <Switch>
        <Route exact path={`${url}`} component={Home} />
        {paths}
        <Redirect from={`${url}*`} to={`${url}`} />
        <Route component={Home} />
      </Switch>
    );
  }
}
