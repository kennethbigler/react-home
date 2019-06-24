import React, { Component } from 'react';
import types from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import reduce from 'lodash/reduce';
import map from 'lodash/map';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dice from '../../../apis/Dice';
import ScoreTable, { ADD_DICE } from './ScoreTable';
import ScoreGraph from './ScoreGraph';
import { addScore } from '../../../store/modules/yahtzee';
// Parents: Main

const getInitialState = () => ({
  roll: 0,
  values: [0, 0, 0, 0, 0],
  saved: [],
  turn: 0,
  topSum: 0,
  finalTopSum: 0,
  bottomSum: 0,
  showScoreButtons: false,
  hasScored: false,
  finish: false,
  top: [
    { name: 'Aces', score: -1 },
    { name: 'Twos', score: -1 },
    { name: 'Threes', score: -1 },
    { name: 'Fours', score: -1 },
    { name: 'Fives', score: -1 },
    { name: 'Sixes', score: -1 },
  ],
  bottom: [
    {
      name: '3 of a kind', hint: ADD_DICE, points: ADD_DICE, score: -1,
    },
    {
      name: '4 of a kind', hint: ADD_DICE, points: ADD_DICE, score: -1,
    },
    {
      name: 'Full House', hint: 'Score 25', points: 25, score: -1,
    },
    {
      name: 'Sm. Straight (4)', hint: 'Score 30', points: 30, score: -1,
    },
    {
      name: 'Lg. Straight (5)', hint: 'Score 40', points: 40, score: -1,
    },
    {
      name: 'Yahtzee', hint: 'Score 50', points: 50, score: -1,
    },
    {
      name: 'Chance', hint: ADD_DICE, points: ADD_DICE, score: -1,
    },
  ],
});

/* --------------------------------------------------
* Home
* -------------------------------------------------- */
class Yahtzee extends Component {
  static propTypes = {
    actions: types.shape({
      addScore: types.func.isRequired,
    }).isRequired,
    scores: types.arrayOf(
      types.shape({
        score: types.number.isRequired,
      }).isRequired,
    ).isRequired,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let { finalTopSum } = prevState;
    const { top, bottom } = prevState;
    let count = 0;

    const topSum = reduce(top, (sum, { score }) => {
      if (score >= 0) {
        count += 1;
        sum += score;
        if (sum >= 63) {
          finalTopSum = sum + 35;
        } else {
          finalTopSum = sum;
        }
      }
      return sum;
    }, 0);

    const bottomSum = reduce(bottom, (sum, { score }) => {
      if (score >= 0) {
        count += 1;
        sum += score;
      }
      return sum;
    }, 0);

    if (count >= 13) {
      return { finish: true };
    }
    if (topSum !== prevState.topSum || bottomSum !== prevState.bottomSum) {
      return { topSum, finalTopSum, bottomSum };
    }
    return null;
  }

  state = getInitialState();

  newGame = () => {
    const { actions } = this.props;
    const { finalTopSum, bottomSum } = this.state;
    actions.addScore(finalTopSum + bottomSum);
    this.setState(getInitialState());
  }

  handleDiceRoll = () => {
    const { roll, hasScored, finish } = this.state;

    if (finish) {
      this.newGame();
    }

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
    const { finish } = this.state;
    if (finish) {
      return 'New Game';
    }

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

  handleTopScore = (points, i) => {
    const { top } = this.state;
    top[i].score = points;
    this.setState({ top, hasScored: true, showScoreButtons: false });
  }

  handleBottomScore = (points, i) => {
    const { bottom } = this.state;
    bottom[i].score = points;
    this.setState({ bottom, hasScored: true, showScoreButtons: false });
  }

  render() {
    const {
      values, saved, roll, top, showScoreButtons, bottom, topSum, finalTopSum, bottomSum,
    } = this.state;
    const { scores } = this.props;

    return (
      <div>
        <div className="flex-container">
          <Typography variant="h2">Yahtzee</Typography>
          <ScoreGraph scores={scores} />
        </div>
        <hr />
        <div className="flex-container">
          <Typography variant="h4">{`Roll #${roll}/3`}</Typography>
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
          <Button color="primary" onClick={this.handleDiceRoll} variant="contained">
            {this.getButtonText(roll)}
          </Button>
        </div>
        <hr />
        <Typography variant="h4">{`Total: ${finalTopSum + bottomSum}`}</Typography>
        <ScoreTable
          values={[...saved, ...values]}
          bottom={bottom}
          top={top}
          onTopScore={this.handleTopScore}
          onBottomScore={this.handleBottomScore}
          showScoreButtons={showScoreButtons}
          topSum={topSum}
          finalTopSum={finalTopSum}
          bottomSum={bottomSum}
        />
      </div>
    );
  }
}

// react-redux export
const mapStateToProps = state => ({ scores: state.yahtzee });
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ addScore }, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Yahtzee);
