import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import DiceAPI from '../../../apis/Dice';
import ScoreTable from './score-table/ScoreTable';
import { ADD_DICE, TopGameScore, BottomGameScore } from './types';
import Header from './Header';
import TableHeader from './TableHeader';
import { DBRootState, Dice } from '../../../store/types';
import {
  addScore, diceClick, newGame, nextRoll,
  updateTop, updateBottom, updateRoll,
} from '../../../store/modules/yahtzee';

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

interface YahtzeeVars {
  topSum: number;
  bottomSum: number;
  finalTopSum: number;
  finish: boolean;
}

const getYahtzeeVars = (topScores: number[], bottomScores: number[]): YahtzeeVars => {
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

  let finalTopSum = topSum;
  if (topSum >= 63) {
    finalTopSum += 35;
  }

  const finish = count >= 13;

  return {
    topSum,
    bottomSum,
    finalTopSum,
    finish,
  };
};

const Yahtzee: React.FC = () => {
  const {
    topScores, bottomScores, values, saved,
    roll, showScoreButtons, scores, hasScored,
  } = useSelector((state: DBRootState) => ({ ...state.yahtzee }));
  const dispatch = useDispatch();

  const {
    topSum, bottomSum, finalTopSum, finish,
  } = React.useMemo(() => getYahtzeeVars(topScores, bottomScores), [topScores, bottomScores]);

  const newYGame = React.useCallback((): void => {
    dispatch(addScore(finalTopSum + bottomSum));
    dispatch(newGame());
  }, [bottomSum, dispatch, finalTopSum]);

  const handleDiceRoll = React.useCallback((): void => {
    if (finish) {
      newYGame();
    }
    if (roll >= 3) {
      if (hasScored === true) {
        dispatch(nextRoll());
      }
      return;
    }

    for (let i = 0; i < values.length; i += 1) {
      values[i] = DiceAPI.roll() as Dice;
    }
    values.sort();
    saved.sort();

    if (roll === 2) {
      dispatch(updateRoll(values, saved, roll + 1 as Dice, true));
    } else {
      dispatch(updateRoll(values, saved, roll + 1 as Dice));
    }
  }, [dispatch, finish, hasScored, newYGame, roll, saved, values]);

  const handleSave = React.useCallback((i: number): void => {
    if (values[i] === 0) {
      return;
    }
    saved.push(values.splice(i, 1)[0]);
    saved.sort();
    dispatch(diceClick(values, saved));
  }, [dispatch, saved, values]);

  const handleUnsave = React.useCallback((i: number): void => {
    values.push(saved.splice(i, 1)[0]);
    values.sort();
    dispatch(diceClick(values, saved));
  }, [dispatch, saved, values]);

  const getButtonText = React.useCallback((rollNum: Dice): string => {
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
  }, [finish]);

  const handleTopScore = React.useCallback((points: number, i: number): void => {
    topScores[i] = points;
    dispatch(updateTop(topScores));
  }, [dispatch, topScores]);

  const handleBottomScore = React.useCallback((points: number, i: number): void => {
    bottomScores[i] = points;
    dispatch(updateBottom(bottomScores));
  }, [bottomScores, dispatch]);

  const top = React.useMemo(
    () => topScores.map((score, i) => ({ ...topConstants[i], score })) as TopGameScore[],
    [topScores],
  );
  const bottom = React.useMemo(
    () => bottomScores.map((score, i) => ({ ...bottomConstants[i], score })) as BottomGameScore[],
    [bottomScores],
  );

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

export default Yahtzee;
