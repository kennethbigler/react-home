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

class ScoreTable extends Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    values: types.arrayOf(types.number.isRequired).isRequired,
    top: types.arrayOf(types.shape({
      name: types.string.isRequired,
      score: types.number.isRequired,
    })),
    onTopScore: types.func.isRequired,
    showScoreButtons: types.bool.isRequired,
  };

  shouldTopButtonDisplay = (d) => {
    const { values } = this.props;
    return reduce(values, (count, val) => {
      if (val === d) {
        count[0] += 1;
        count[1] += d;
      }
      return count;
    }, [0, 0]);
  }

  getScoreDisplay = (sum, score, count, i) => {
    const { onTopScore, showScoreButtons } = this.props;
    if (score >= 0) {
      return score;
    }
    if (showScoreButtons) {
      if (count >= 3) {
        return (
          <Button color="primary" onClick={() => onTopScore(sum, i)} variant="outlined">
            {`Add ${sum} Points`}
          </Button>
        );
      }
      return (
        <Button color="primary" onClick={() => onTopScore(0, i)} variant="outlined">
          {'Take 0'}
        </Button>
      );
    }
  }

  render() {
    const { top } = this.props;
    let topSum = 0;
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
          {
            map(top, ({ name, score }, i) => {
              if (score >= 0) {
                topSum += score;
              }
              const d = i + 1;
              const [count, sum] = this.shouldTopButtonDisplay(d);
              return (
                <TableRow key={name}>
                  <TableCell>{`${name}: ${d},${d},${d} = ${d * 3}`}</TableCell>
                  <TableCell>{`Count and add only ${name}`}</TableCell>
                  <TableCell>{this.getScoreDisplay(sum, score, count, i)}</TableCell>
                </TableRow>
              );
            })
          }
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell>{topSum}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

export default ScoreTable;
