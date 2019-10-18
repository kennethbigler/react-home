import React from 'react';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import { Dice, GameScore, ADD_DICE } from './types';
import {
  hasXDice, isFullHouse, isStraight, canYahtzeeBonus,
} from './yahtzeeHelper';

interface ScoreTableProps {
  bottom: GameScore[];
  bottomSum: number;
  finalTopSum: number;
  onTopScore: Function;
  onBottomScore: Function;
  showScoreButtons: boolean;
  top: GameScore[];
  topSum: number;
  values: Dice[];
}

const centerStyle: React.CSSProperties = { textAlign: 'center' };

const ScoreTable: React.FC<ScoreTableProps> = (props: ScoreTableProps) => {
  const getButtonInfo = (d: number): [number, number] => {
    const { values } = props;
    return reduce(values, (count, val) => {
      if (val === d) {
        count[0] += 1;
        count[1] += d;
      }
      return count;
    }, [0, 0]);
  };

  const getScoreButton = (showButton: boolean, points: number, top: boolean, i: number): React.ReactNode => {
    // eslint-disable-next-line react/prop-types
    const { onTopScore, onBottomScore } = props;
    return showButton
      ? (
        <Button
          color="primary"
          variant="outlined"
          onClick={top
            ? (): void => onTopScore(points, i)
            : (): void => onBottomScore(points, i)}
        >
          {`Add ${points} Points`}
        </Button>
      ) : (
        <Button
          color="primary"
          variant="outlined"
          onClick={top
            ? (): void => onTopScore(0, i)
            : (): void => onBottomScore(0, i)}
        >
          0
        </Button>
      );
  };

  const getTopTableButtons = (score: number, showButton: boolean, sum: number, i: number): React.ReactNode | null => {
    const { showScoreButtons } = props;
    if (score >= 0) {
      return score;
    }
    return showScoreButtons ? getScoreButton(showButton, sum, true, i) : null;
  };

  const generateTopTable = (): React.ReactNode => {
    const { top } = props;
    return map(top, ({ name, score }, i) => {
      const d = i + 1;
      const [count, sum] = getButtonInfo(i + 1);
      const showButton = count >= 1;

      return (
        <TableRow key={name}>
          <TableCell>{`${name}: ${d},${d},${d} = ${d * 3}`}</TableCell>
          <TableCell>{`Add Only ${name}`}</TableCell>
          <TableCell style={centerStyle}>{getTopTableButtons(score, showButton, sum, i)}</TableCell>
        </TableRow>
      );
    });
  };

  const getDiceValue = (): number => {
    const { values } = props;
    return reduce(values, (sum, d) => sum + d, 0);
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
    const { showScoreButtons } = props;
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
    const { bottom } = props;
    const hasYahtzee = bottom[5].score > 0;
    return map(bottom, (gameScore, i) => {
      const {
        name, hint, points, score,
      } = gameScore;

      const parsedPoints = (points === ADD_DICE) ? getDiceValue() : points;

      return (
        <TableRow key={name}>
          <TableCell>{name}</TableCell>
          <TableCell>{hint}</TableCell>
          <TableCell style={centerStyle}>{getBottomTableButtons(score, parsedPoints, hasYahtzee, i)}</TableCell>
        </TableRow>
      );
    });
  };

  const { topSum, finalTopSum, bottomSum } = props;

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Minimum Required for Bonus</TableCell>
          <TableCell>How to Score</TableCell>
          <TableCell style={centerStyle}>Game Score</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {generateTopTable()}
        <TableRow>
          <TableCell colSpan={2}>Total == 63</TableCell>
          <TableCell style={centerStyle}>{topSum}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bonus if &gt;= 63</TableCell>
          <TableCell>Score 35</TableCell>
          <TableCell style={centerStyle}>{topSum >= 63 ? 35 : 0}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={2}>Upper Half Total</TableCell>
          <TableCell style={centerStyle}>{finalTopSum}</TableCell>
        </TableRow>
        <TableRow />
        {generateBottomTable()}
        <TableRow>
          <TableCell colSpan={2}>Lower Half Total</TableCell>
          <TableCell style={centerStyle}>{bottomSum}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={2}>Upper Half Total</TableCell>
          <TableCell style={centerStyle}>{finalTopSum}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={2}>Grand Total</TableCell>
          <TableCell style={centerStyle}>{finalTopSum + bottomSum}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ScoreTable;
