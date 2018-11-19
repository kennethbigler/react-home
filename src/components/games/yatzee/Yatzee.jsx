// react
import React, { Component } from 'react';
import map from 'lodash/map';
import Button from '@material-ui/core/Button';
import Dice from '../../../apis/Dice';
// Parents: Main

const NUM_DICE = 5;

const getInitialState = () => ({
  roll: 0,
  values: [],
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

    const { saved, values } = this.state;

    for (let i = 0; i < NUM_DICE; i += 1) {
      console.log(!saved[i]);
      if (!saved[i]) {
        values[i] = Dice.roll();
      }
    }

    console.log(values);
    this.setState({ values, roll: roll + 1 });
  }

  handleSave = (i) => {
    const { saved, values } = this.state;
    saved[i] = values[i];
    this.setState({ saved });
    console.log(values, saved);
  }

  render() {
    const { values, saved } = this.state;

    return (
      <div>
        <div>
          {map(values, (val, i) => (
            <Button color={saved[i] ? 'secondary' : 'primary'} onClick={() => this.handleSave(i)} variant="contained" key={i}>
              {val}
            </Button>
          ))}
        </div>
        <Button color="primary" onClick={this.handleDiceRoll} variant="contained">
          Roll Dice
        </Button>
      </div>
    );
  }
}

export default Yatzee;
