import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Typography from '@material-ui/core/Typography';
import DiceAPI from '../../../apis/Dice';
import ScoreTable from './score-table/ScoreTable';
import { ADD_DICE, TopGameScore, BottomGameScore } from './types';
import Header from './Header';
import TableHeader from './TableHeader';
import { DBRootState, Dice, DBYahtzee } from '../../../store/types';
import {
  addScore, diceClick, newGame, nextRoll,
  updateTop, updateBottom, updateRoll,
} from '../../../store/modules/yahtzee';

interface YahtzeeActions {
  addScore: Function;
  diceClick: Function;
  newGame: Function;
  nextRoll: Function;
  updateTop: Function;
  updateBottom: Function;
  updateRoll: Function;
}
interface YahtzeeProps extends DBYahtzee {
  actions: YahtzeeActions;
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

const Yahtzee: React.FC<YahtzeeProps> = (props: YahtzeeProps) => {
  const {
    topScores, bottomScores, values, saved,
    roll, showScoreButtons, scores, actions,
  } = props;

  let count = 0;

  const topSum = topScores.reduce((sum, score) => {
    if (score >= 0) {
      count += 1;
      sum += score;
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
  let finalTopSum = 0;
  if (topSum >= 63) {
    finalTopSum += topSum + 35;
  } else {
    finalTopSum += topSum;
  }

  const finish = count >= 13;

  const newYGame = (): void => {
    actions.addScore(finalTopSum + bottomSum);
    actions.newGame();
  };

  const handleDiceRoll = (): void => {
    const { hasScored } = props;

    if (finish) {
      newYGame();
    }
    if (roll >= 3) {
      if (hasScored === true) {
        actions.nextRoll();
      }
      return;
    }

    for (let i = 0; i < values.length; i += 1) {
      values[i] = DiceAPI.roll() as Dice;
    }
    values.sort();
    saved.sort();

    if (roll === 2) {
      actions.updateRoll(values, saved, roll + 1, true);
    } else {
      actions.updateRoll(values, saved, roll + 1);
    }
  };

  const handleSave = (i: number): void => {
    if (values[i] === 0) {
      return;
    }
    saved.push(values.splice(i, 1)[0]);
    saved.sort();
    actions.diceClick(values, saved);
  };

  const handleUnsave = (i: number): void => {
    values.push(saved.splice(i, 1)[0]);
    values.sort();
    actions.diceClick(values, saved);
  };

  const getButtonText = (rollNum: Dice): string => {
    if (finish) {
      return 'New Game';
    }

    switch (rollNum) {
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
  };

  const handleTopScore = (points: number, i: number): void => {
    topScores[i] = points;
    actions.updateTop(topScores);
  };

  const handleBottomScore = (points: number, i: number): void => {
    bottomScores[i] = points;
    actions.updateBottom(bottomScores);
  };

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
        handleUnsave={handleUnsave}
        handleSave={handleSave}
        handleDiceRoll={handleDiceRoll}
        getButtonText={getButtonText}
      />
      <hr />
      <Typography variant="h4">{`Total: ${finalTopSum + bottomSum}`}</Typography>
      <ScoreTable
        values={[...saved, ...values]}
        bottom={bottom}
        top={top}
        onTopScore={handleTopScore}
        onBottomScore={handleBottomScore}
        showScoreButtons={showScoreButtons}
        topSum={topSum}
        finalTopSum={finalTopSum}
        bottomSum={bottomSum}
      />
    </>
  );
};

// react-redux export
const mapStateToProps = (state: DBRootState): DBYahtzee => ({ ...state.yahtzee });
const mapDispatchToProps = (dispatch: Dispatch): { actions: YahtzeeActions } => ({
  actions: bindActionCreators({
    addScore,
    diceClick,
    newGame,
    nextRoll,
    updateTop,
    updateBottom,
    updateRoll,
  }, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Yahtzee);
