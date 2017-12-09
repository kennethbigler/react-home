import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { TIMELINE_TITLE } from './features/Timeline';
import { Home } from './pages/Home';
import { Work } from './pages/Work';
import { Education } from './pages/Education';
import { Projects } from './pages/Projects';
import { DougScore } from './pages/DougScore';
import { PokerNight } from './pages/PokerNight';
import { Resume } from './pages/Resume';
import classes from '../constants/classes';
import workExp from '../constants/work';

const styles = {
  page: {
    padding: '1em'
  }
};

class Main extends Component {
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
    let expanded = this.state.expanded;
    expanded[key] = exp;
    this.setState({ expanded });
  };

  render() {
    const education = (
      <Education
        onClick={this.handleExpandChange}
        classes={classes}
        expanded={this.state.expanded}
      />
    );
    const work = (
      <Work
        onClick={this.handleExpandChange}
        workExp={workExp}
        expanded={this.state.expanded}
      />
    );
    return (
      <div>
        <main style={styles.page}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/home" component={Home} />
            <Route path="/work" render={() => work} />
            <Route path="/education" render={() => education} />
            <Route path="/projects" component={Projects} />
            <Route path="/resume" component={Resume} />
            <Route path="/doug" component={DougScore} />
            <Route path="/poker" component={PokerNight} />
          </Switch>
        </main>
      </div>
    );
  }
}

export default Main;
