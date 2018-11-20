// react
import React, { Component } from 'react';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import Button from '@material-ui/core/Button';
import Dice from '../../../apis/Dice';
import ScoreTable from './ScoreTable';
// Parents: Main

const getInitialState = () => ({
  roll: 0,
  values: [0, 0, 0, 0, 0],
  saved: [],
  turn: 0,
  showScoreButtons: false,
  hasScored: false,
  top: [
    { name: 'Aces', score: -1 },
    { name: 'Twos', score: -1 },
    { name: 'Threes', score: -1 },
    { name: 'Fours', score: -1 },
    { name: 'Fives', score: -1 },
    { name: 'Sixes', score: -1 },
  ],
});

/* --------------------------------------------------
* Home
* -------------------------------------------------- */
class Yatzee extends Component {
  state = getInitialState();

  handleDiceRoll = () => {
    const { roll, hasScored } = this.state;

    if (roll >= 3 && hasScored === false) {
      return;
    }
    if (roll >= 3 && hasScored === true) {
      this.setState({
        roll: 0,
        values: [0, 0, 0, 0, 0],
        saved: [],
        hasScored: false,
      });
      return;
    }

    const { values, saved } = this.state;

    for (let i = 0; i < values.length; i += 1) {
      values[i] = Dice.roll();
    }
    values.sort();
    saved.sort();

    if (roll === 2) {
      this.setState({
        showScoreButtons: true, values, saved, roll: roll + 1,
      });
    } else {
      this.setState({ values, saved, roll: roll + 1 });
    }
  }

  handleSave = (i) => {
    const { saved, values } = this.state;
    if (values[i] === 0) {
      return;
    }
    saved.push(values.splice(i, 1)[0]);
    saved.sort();
    this.setState({ saved });
  }

  handleUnsave = (i) => {
    const { saved, values } = this.state;
    values.push(saved.splice(i, 1)[0]);
    values.sort();
    this.setState({ values });
  }

  getButtonText = (roll) => {
    switch (roll) {
      case 0:
        return 'First Roll';
      case 1:
        return 'Second Roll';
      case 2:
        return 'Last Roll';
      case 3:
        return 'Next Turn';
      default:
        return 'Error';
    }
  }

  getSumScore = () => {
    const { saved, values } = this.state;
    let sum = 0;
    forEach(saved, (val) => {
      sum += val;
    });
    forEach(values, (val) => {
      sum += val;
    });
    return sum;
  }

  handleTopScore = (points, i) => {
    const { top } = this.state;
    top[i].score = points;
    this.setState({ top, hasScored: true, showScoreButtons: false });
  }

  render() {
    const {
      values, saved, roll, top, showScoreButtons,
    } = this.state;

    return (
      <div>
        <h1>Yatzee</h1>
        <h2>
          {`Roll #${roll}/3`}
        </h2>
        <hr />
        <br />
        <div style={{ display: 'block', margin: 'auto', width: 320 }}>
          {map(saved, (val, i) => (
            <Button color="secondary" onClick={() => this.handleUnsave(i)} variant="outlined" key={i}>
              {val}
            </Button>
          ))}
          {map(values, (val, i) => (
            <Button color="primary" onClick={() => this.handleSave(i)} variant="outlined" key={i}>
              {val}
            </Button>
          ))}
        </div>
        <br />
        <hr />
        <br />
        <Button color="primary" onClick={this.handleDiceRoll} variant="contained">
          {this.getButtonText(roll)}
        </Button>
        <ScoreTable
          values={[...saved, ...values]}
          top={top}
          onTopScore={this.handleTopScore}
          showScoreButtons={showScoreButtons}
        />
      </div>
    );
  }
}

export default Yatzee;
