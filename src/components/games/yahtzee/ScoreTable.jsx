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
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let { finalTopSum } = prevState;
    if (finalTopSum) {
      return null;
    }

    const { top } = nextProps;
    let count = 0;
    const topSum = reduce(top, (sum, { score }) => {
      if (score >= 0) {
        count += 1;
        sum += score;
        if (count === 6) {
          if (sum >= 63) {
            finalTopSum = sum + 35;
          } else {
            finalTopSum = sum;
          }
        }
      }
      return sum;
    }, 0);
    return { topSum, finalTopSum };
  }

  state = {
    topSum: 0,
    bottomSum: 0,
    finalTopSum: 0,
  }

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

  getScoreDisplay = (score, showButton, points, top, i) => {
    if (score >= 0) {
      return score;
    }

    const { onTopScore, showScoreButtons, onBottomScore } = this.props;
    if (showScoreButtons) {
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
    return null;
  }

  generateTopTable = () => {
    const { top } = this.props;
    return map(top, ({ name, score }, i) => {
      const d = i + 1;
      const [count, sum] = this.getButtonInfo(i + 1);
      const showButton = count >= 3;

      return (
        <TableRow key={name}>
          <TableCell>{`${name}: ${d},${d},${d} = ${d * 3}`}</TableCell>
          <TableCell>{`Count and add only ${name}`}</TableCell>
          <TableCell>{this.getScoreDisplay(score, showButton, sum, true, i)}</TableCell>
        </TableRow>
      );
    });
  }

  getDiceValue = () => {
    const { values } = this.props;
    return reduce(values, (sum, d) => sum + d, 0);
  }

  hasXDice = n => (hist, val) => {
    if (hist === true) {
      return true;
    }
    if (!hist[val]) {
      hist[val] = 1;
    } else {
      hist[val] += 1;
      if (hist[val] >= n) {
        return true;
      }
    }
    return hist;
  };

  showButton = (i) => {
    const { values } = this.props;
    switch (i) {
      case 0: {
        // 3 of a kind
        const histogram = reduce(values, this.hasXDice(3), {});
        return histogram === true;
      }
      case 1: {
        // 4 of a kind
        const histogram = reduce(values, this.hasXDice(4), {});
        return histogram === true;
      }
      case 2: {
        // Full House
        return true;
      }
      case 3: {
        // Sm. Straight
        return true;
      }
      case 4: {
        // Lg. Straight
        return true;
      }
      case 5: {
        // Yahtzee
        const histogram = reduce(values, this.hasXDice(5), {});
        return histogram === true;
      }
      case 6: {
        // Chance
        return true;
      }
      default: {
        console.error('Unexpeccted Value');
        return false;
      }
    }
  }

  generateBottomTable = () => {
    const { bottom } = this.props;
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
          <TableCell>{this.getScoreDisplay(score, this.showButton(i), points, false, i)}</TableCell>
        </TableRow>
      );
    });
  }

  render() {
    const { topSum, finalTopSum, bottomSum } = this.state;

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
