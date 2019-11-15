import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { TopGameScore, BottomGameScore, ADD_DICE } from '../types';
import { Dice } from '../../../../store/types';
import {
  hasXDice, isFullHouse, isStraight, canYahtzeeBonus,
} from './scoreTableHelper';
import BottomScores from './BottomScores';

interface BottomTableProps {
  bottom: BottomGameScore[];
  bottomSum: number;
  finalTopSum: number;
  getScoreButton: Function;
  showScoreButtons: boolean;
  style: React.CSSProperties;
  top: TopGameScore[];
  values: Dice[];
}

const BottomTable: React.FC<BottomTableProps> = (props: BottomTableProps) => {
  const getDiceValue = (): number => {
    const { values } = props;
    return values.reduce((sum: number, d) => sum + d, 0);
  };

  const showButton = (i: number): boolean => {
    const { values } = props;
    switch (i) {
      case 0: // 3 of a kind
        return hasXDice(values, 3);
      case 1: // 4 of a kind
        return hasXDice(values, 4);
      case 2: // Full House
        return isFullHouse(values);
      case 3: // Sm. Straight
        return isStraight(values, 4);
      case 4: // Lg. Straight
        return isStraight(values, 5);
      case 5: // Yahtzee
        return hasXDice(values, 5);
      case 6: // Chance
        return true;
      default:
        // eslint-disable-next-line no-console
        console.error('Unexpected Value');
        return false;
    }
  };

  const getBottomTableButtons = (score: number, points: number, hasYahtzee: boolean, i: number): React.ReactNode | null => {
    const { showScoreButtons, getScoreButton } = props;
    if (score >= 0) {
      return score;
    }
    if (showScoreButtons) {
      // Yahtzee Bonus
      if (hasYahtzee) {
        const { values, top } = props;
        if (canYahtzeeBonus(values, top)) {
          return getScoreButton(true, points + 100, false, i);
        }
      }
      return getScoreButton(showButton(i), points, false, i);
    }
    return null;
  };

  const generateBottomTable = (): React.ReactNode => {
    const { bottom, style } = props;
    const hasYahtzee = bottom[5].score > 0;
    return bottom.map((gameScore, i) => {
      const {
        name, hint, points, score,
      } = gameScore;

      const parsedPoints = (points === ADD_DICE) ? getDiceValue() : points;

      return (
        <TableRow key={name}>
          <TableCell>{name}</TableCell>
          <TableCell>{hint}</TableCell>
          <TableCell style={style}>{getBottomTableButtons(score, parsedPoints, hasYahtzee, i)}</TableCell>
        </TableRow>
      );
    });
  };

  const { style, finalTopSum, bottomSum } = props;

  return (
    <>
      {generateBottomTable()}
      <BottomScores bottomSum={bottomSum} finalTopSum={finalTopSum} style={style} />
    </>
  );
};

export default BottomTable;
