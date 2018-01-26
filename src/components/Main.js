import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { TIMELINE_TITLE } from './features/Timeline';
import { Home } from './resume/Home';
import { Work } from './resume/Work';
import { Education } from './resume/Education';
import { Projects } from './resume/Projects';
import { Resume } from './resume/Resume';
import { PokerNight } from './casino/PokerNight';
import { MurderMystery } from './casino/MurderMystery';
import { Casino } from './casino/Casino';
import { Slots } from './casino/Slots';
import { BlackJack } from './casino/BlackJack';
import { Poker } from './casino/Poker';
import { TicTacToe } from './resume/TicTacToe';
import classes from '../constants/classes';
import workExp from '../constants/work';
// Parents: App

const styles = { page: { padding: '1em' } };

export class Main extends Component {
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
        onTouchTap={this.handleExpandChange}
        classes={classes}
        expanded={this.state.expanded}
      />
    );
    const work = (
      <Work
        onTouchTap={this.handleExpandChange}
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
            <Route path="/tictactoe" component={TicTacToe} />
            <Route path="/(poker|casino/pokernight)" component={PokerNight} />
            <Route exact path="/casino" component={Casino} />
            <Route path="/casino/blackjack" component={BlackJack} />
            <Route path="/casino/murder" component={MurderMystery} />
            <Route path="/casino/slots" component={Slots} />
            <Route path="/casino/poker" component={Poker} />
          </Switch>
        </main>
      </div>
    );
  }
}
