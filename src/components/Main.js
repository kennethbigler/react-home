import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { TIMELINE_TITLE } from './common/timeline/Timeline';
import { Home, Work, Education, Resume, TravelMap, GitTools } from './resume/';
import {
  PokerNight,
  MurderMystery,
  GameHome,
  Slots,
  BlackJack,
  Poker,
  TicTacToe,
  Connect4,
  DealOrNoDeal
} from './games/';
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
            <Route path="/resume" component={Resume} />
            <Route path="/travel" component={TravelMap} />
            <Route path="/git-tools" component={GitTools} />
            <Route path="/(tictactoe|games/tictactoe)" component={TicTacToe} />
            <Route path="/(poker|games/pokernight)" component={PokerNight} />
            <Route exact path="/games" component={GameHome} />
            <Route path="/games/blackjack" component={BlackJack} />
            <Route path="/games/murder" component={MurderMystery} />
            <Route path="/games/slots" component={Slots} />
            <Route path="/games/poker" component={Poker} />
            <Route path="/games/connect4" component={Connect4} />
            <Route path="/games/deal" component={DealOrNoDeal} />
          </Switch>
        </main>
      </div>
    );
  }
}
