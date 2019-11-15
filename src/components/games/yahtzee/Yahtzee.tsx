import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Typography from '@material-ui/core/Typography';
import DiceAPI from '../../../apis/Dice';
import ScoreTable from './score-table/ScoreTable';
import {
  ADD_DICE, Scores, TopGameScore, BottomGameScore,
  Dice,
} from './types';
import { addScore } from '../../../store/modules/yahtzee';
import Header from './Header';
import TableHeader from './TableHeader';
import { DBRootState } from '../../../store/types';

interface YahtzeeActions {
  addScore: Function;
}
interface YahtzeeProps {
  actions: YahtzeeActions;
  scores: Scores;
}
interface YahtzeeState {
  roll: Dice;
  values: Dice[];
  saved: Dice[];
  turn: number;
  topSum: number;
  finalTopSum: number;
  bottomSum: number;
  showScoreButtons: boolean;
  hasScored: boolean;
  finish: boolean;
  topScores: number[];
  bottomScores: number[];
}

const topConstants = [
  { name: 'Aces' },
  { name: 'Twos' },
  { name: 'Threes' },
  { name: 'Fours' },
  { name: 'Fives' },
  { name: 'Sixes' },
];
const bottomConstants = [
  { name: '3 of a kind', hint: ADD_DICE, points: ADD_DICE },
  { name: '4 of a kind', hint: ADD_DICE, points: ADD_DICE },
  { name: 'Full House', hint: 'Score 25', points: 25 },
  { name: 'Sm. Straight (4)', hint: 'Score 30', points: 30 },
  { name: 'Lg. Straight (5)', hint: 'Score 40', points: 40 },
  { name: 'Yahtzee', hint: 'Score 50', points: 50 },
  { name: 'Chance', hint: ADD_DICE, points: ADD_DICE },
];

const getInitialState = (): YahtzeeState => ({
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
  topScores: [-1, -1, -1, -1, -1, -1],
  bottomScores: [-1, -1, -1, -1, -1, -1, -1],
});

class Yahtzee extends React.Component<YahtzeeProps, YahtzeeState> {
  static getDerivedStateFromProps: React.GetDerivedStateFromProps<YahtzeeProps, YahtzeeState> = (_props, state) => {
    let { finalTopSum } = state;
    const { topScores, bottomScores } = state;
    let count = 0;

    const topSum = topScores.reduce((sum, score) => {
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

    const bottomSum = bottomScores.reduce((sum, score) => {
      if (score >= 0) {
        count += 1;
        sum += score;
      }
      return sum;
    }, 0);

    if (count >= 13) {
      return { finish: true };
    }
    if (topSum !== state.topSum || bottomSum !== state.bottomSum) {
      return { topSum, finalTopSum, bottomSum };
    }
    return null;
  }

  constructor(props: YahtzeeProps) {
    super(props);
    this.state = getInitialState();
  }

  newGame = (): void => {
    const { actions } = this.props;
    const { finalTopSum, bottomSum } = this.state;
    actions.addScore(finalTopSum + bottomSum);
    this.setState(getInitialState());
  }

  handleDiceRoll = (): void => {
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
      values[i] = DiceAPI.roll() as Dice;
    }
    values.sort();
    saved.sort();

    if (roll === 2) {
      this.setState({
        showScoreButtons: true, values, saved, roll: roll + 1 as Dice,
      });
    } else {
      this.setState({ values, saved, roll: roll + 1 as Dice });
    }
  }

  handleSave = (i: number): void => {
    const { saved, values } = this.state;
    if (values[i] === 0) {
      return;
    }
    saved.push(values.splice(i, 1)[0]);
    saved.sort();
    this.setState({ saved });
  }

  handleUnsave = (i: number): void => {
    const { saved, values } = this.state;
    values.push(saved.splice(i, 1)[0]);
    values.sort();
    this.setState({ values });
  }

  getButtonText = (roll: Dice): string => {
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

  handleTopScore = (points: number, i: number): void => {
    const { topScores } = this.state;
    topScores[i] = points;
    this.setState({ topScores, hasScored: true, showScoreButtons: false });
  }

  handleBottomScore = (points: number, i: number): void => {
    const { bottomScores } = this.state;
    bottomScores[i] = points;
    this.setState({ bottomScores, hasScored: true, showScoreButtons: false });
  }

  render(): React.ReactNode {
    const {
      values, saved, roll, topScores, showScoreButtons,
      bottomScores, topSum, finalTopSum, bottomSum,
    } = this.state;
    const { scores } = this.props;

    const top = topScores.map((score, i) => ({ ...topConstants[i], score })) as TopGameScore[];
    const bottom = bottomScores.map((score, i) => ({ ...bottomConstants[i], score })) as BottomGameScore[];

    return (
      <>
        <Header scores={scores} />
        <hr />
        <TableHeader
          values={values}
          saved={saved}
          roll={roll}
          handleUnsave={this.handleUnsave}
          handleSave={this.handleSave}
          handleDiceRoll={this.handleDiceRoll}
          getButtonText={this.getButtonText}
        />
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
      </>
    );
  }
}

// react-redux export
const mapStateToProps = (state: DBRootState): { scores: Scores } => ({ scores: state.yahtzee });
const mapDispatchToProps = (dispatch: Dispatch): { actions: YahtzeeActions } => ({
  actions: bindActionCreators({ addScore }, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Yahtzee);
