import React, { Component } from 'react';
import types from 'prop-types';
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
// Parents: Popup

export const ADD_DICE = 'Add total of all dice';

class ScoreTable extends Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    values: types.arrayOf(types.number.isRequired).isRequired,
    top: types.arrayOf(types.shape({
      name: types.string.isRequired,
      score: types.number.isRequired,
    })),
    bottom: types.arrayOf(types.shape({
      name: types.string.isRequired,
      score: types.number.isRequired,
    })),
    onTopScore: types.func.isRequired,
    onBottomScore: types.func.isRequired,
    showScoreButtons: types.bool.isRequired,
    topSum: types.number.isRequired,
    finalTopSum: types.number.isRequired,
    bottomSum: types.number.isRequired,
  };

  getButtonInfo = (d) => {
    const { values } = this.props;
    return reduce(values, (count, val) => {
      if (val === d) {
        count[0] += 1;
        count[1] += d;
      }
      return count;
    }, [0, 0]);
  }

  getScoreButton = (showButton, points, top, i) => {
    const { onTopScore, onBottomScore } = this.props;
    return showButton
      ? (
        <Button
          color="primary"
          variant="outlined"
          onClick={top
            ? () => onTopScore(points, i)
            : () => onBottomScore(points, i)}
        >
          {`Add ${points} Points`}
        </Button>
      ) : (
        <Button
          color="primary"
          variant="outlined"
          onClick={top
            ? () => onTopScore(0, i)
            : () => onBottomScore(0, i)}
        >
          0
        </Button>
      );
  }

  getTopTableButtons = (score, showButton, sum, i) => {
    const { showScoreButtons } = this.props;
    if (score >= 0) {
      return score;
    }
    return showScoreButtons ? this.getScoreButton(showButton, sum, true, i) : null;
  }

  generateTopTable = () => {
    const { top } = this.props;
    return map(top, ({ name, score }, i) => {
      const d = i + 1;
      const [count, sum] = this.getButtonInfo(i + 1);
      const showButton = count >= 1;

      return (
        <TableRow key={name}>
          <TableCell>{`${name}: ${d},${d},${d} = ${d * 3}`}</TableCell>
          <TableCell>{`Count and add only ${name}`}</TableCell>
          <TableCell>{this.getTopTableButtons(score, showButton, sum, i)}</TableCell>
        </TableRow>
      );
    });
  }

  getDiceValue = () => {
    const { values } = this.props;
    return reduce(values, (sum, d) => sum + d, 0);
  }

  showButton = (i) => {
    const { values } = this.props;
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
        console.error('Unexpeccted Value');
        return false;
    }
  }

  getBottomTableButtons = (score, points, hasYahtzee, i) => {
    const { showScoreButtons } = this.props;
    if (score >= 0) {
      return score;
    }
    if (showScoreButtons) {
      if (hasYahtzee) {
        const { values, top } = this.props;
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
          return this.getScoreButton(true, points + 100, false, i);
        }
      }
      return this.getScoreButton(this.showButton(i), points, false, i);
    }
    return null;
  }

  generateBottomTable = () => {
    const { bottom } = this.props;
    const hasYahtzee = bottom[5].score > 0;
    return map(bottom, ({
      name, hint, points, score,
    }, i) => {
      if (points === ADD_DICE) {
        points = this.getDiceValue();
      }

      return (
        <TableRow key={name}>
          <TableCell>{name}</TableCell>
          <TableCell>{hint}</TableCell>
          <TableCell>{this.getBottomTableButtons(score, points, hasYahtzee, i)}</TableCell>
        </TableRow>
      );
    });
  }

  render() {
    const { topSum, finalTopSum, bottomSum } = this.props;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Minimum Required for Bonus</TableCell>
            <TableCell>How to Score</TableCell>
            <TableCell>Game Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.generateTopTable()}
          <TableRow>
            <TableCell colSpan={2}>Total = 63</TableCell>
            <TableCell>{topSum}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Bonus if 63 or over</TableCell>
            <TableCell>Score 35</TableCell>
            <TableCell>{topSum >= 63 ? 35 : 0}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total of Upper Half</TableCell>
            <TableCell>{finalTopSum}</TableCell>
          </TableRow>
          <TableRow />
          {this.generateBottomTable()}
          <TableRow>
            <TableCell colSpan={2}>Total of lower half</TableCell>
            <TableCell>{bottomSum}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total of upper half</TableCell>
            <TableCell>{finalTopSum}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Grand Total</TableCell>
            <TableCell>{finalTopSum + bottomSum}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

export default ScoreTable;
