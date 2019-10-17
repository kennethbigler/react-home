import React from 'react';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import {
  hasXDice, getHistogram, isFullHouse, isStraight,
} from './yahtzeeHelper';

interface GameScore {
  name: string;
  score: number;
}
interface ScoreTableProps {
  values: number[];
  top: GameScore[];
  bottom: GameScore[];
  onTopScore: Function;
  onBottomScore: Function;
  showScoreButtons: boolean;
  topSum: number;
  finalTopSum: number;
  bottomSum: number;
}

export const ADD_DICE = 'Sum of Dice';
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

  const showButton = (i) => {
    const { values } = props;
    switch (i) {
      case 0: // 3 of a kind
        return reduce(values, hasXDice(3), {}) === true;
      case 1: // 4 of a kind
        return reduce(values, hasXDice(4), {}) === true;
      case 2: // Full House
        return isFullHouse(reduce(values, getHistogram(), {}));
      case 3: // Sm. Straight
        return isStraight(reduce(values, getHistogram(), {}), 4);
      case 4: // Lg. Straight
        return isStraight(reduce(values, getHistogram(), {}), 5);
      case 5: // Yahtzee
        return reduce(values, hasXDice(5), {}) === true;
      case 6: // Chance
        return true;
      default:
        // eslint-disable-next-line no-console
        console.error('Unexpected Value');
        return false;
    }
  };

  const getBottomTableButtons = (score, points, hasYahtzee, i) => {
    const { showScoreButtons } = props;
    if (score >= 0) {
      return score;
    }
    if (showScoreButtons) {
      // Yahtzee Bonus
      if (hasYahtzee) {
        const { values, top } = props;
        const canYahtzeeBonus = reduce(
          reduce(values, getHistogram(), {}),
          (acc, value, key) => {
            if (value === 5 && top[key - 1].score >= 0) {
              return true;
            }
            return acc;
          },
          false,
        );
        if (canYahtzeeBonus) {
          return getScoreButton(true, points + 100, false, i);
        }
      }
      return getScoreButton(showButton(i), points, false, i);
    }
    return null;
  };

  const generateBottomTable = () => {
    const { bottom } = props;
    const hasYahtzee = bottom[5].score > 0;
    return map(bottom, ({
      name, hint, points, score,
    }, i) => {
      if (points === ADD_DICE) {
        points = getDiceValue();
      }

      return (
        <TableRow key={name}>
          <TableCell>{name}</TableCell>
          <TableCell>{hint}</TableCell>
          <TableCell style={centerStyle}>{getBottomTableButtons(score, points, hasYahtzee, i)}</TableCell>
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
