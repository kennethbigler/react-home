// react
import React, { Component } from 'react';
import map from 'lodash/map';
import Button from '@material-ui/core/Button';
import Dice from '../../../apis/Dice';
// Parents: Main

const NUM_DICE = 5;

const getInitialState = () => ({
  roll: 0,
  values: [0, 0, 0, 0, 0],
  saved: [],
});

/* --------------------------------------------------
* Home
* -------------------------------------------------- */
class Yatzee extends Component {
  state = getInitialState();

  handleDiceRoll = () => {
    const { roll } = this.state;
    if (roll >= 3) {
      this.setState(getInitialState());
      return;
    }

    const { values, saved } = this.state;

    for (let i = 0; i < values.length; i += 1) {
      values[i] = Dice.roll();
    }
    values.sort();
    saved.sort();

    this.setState({ values, saved, roll: roll + 1 });
  }

  handleSave = (i) => {
    const { saved, values } = this.state;
    saved.push(values.splice(i, 1)[0]);
    this.setState({ saved });
  }

  getButtonText = (roll) => {
    switch (roll) {
      case 0:
        return 'Start Game';
      case 1:
      case 2:
        return 'Roll Dice';
      case 3:
        return 'Restart';
      default:
        return 'Error';
    }
  }

  render() {
    const { values, saved, roll } = this.state;

    return (
      <div>
        <h1>Yatzee</h1>
        <h2>
          Roll #
          {roll}
        </h2>
        <div>
          {map(saved, (val, i) => (
            <Button color="secondary" onClick={() => this.handleSave(i)} variant="outlined" key={i}>
              {val}
            </Button>
          ))}
          {map(values, (val, i) => (
            <Button color="primary" onClick={() => this.handleSave(i)} variant="outlined" key={i}>
              {val}
            </Button>
          ))}
        </div>
        <Button color="primary" onClick={this.handleDiceRoll} variant="contained">
          {this.getButtonText(roll)}
        </Button>
      </div>
    );
  }
}

export default Yatzee;
