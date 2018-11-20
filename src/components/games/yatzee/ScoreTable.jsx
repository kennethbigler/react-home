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

  render() {
    const { top, onTopScore } = this.props;
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
              const d = i + 1;
              const [count, sum] = this.shouldTopButtonDisplay(d);
              return (
                <TableRow key={name}>
                  <TableCell>{`${name}: ${d},${d},${d} = ${d * 3}`}</TableCell>
                  <TableCell>{`Count and add only ${name}`}</TableCell>
                  <TableCell>
                    {score ? (<div>{score}</div>) : count >= 3 && (
                      <Button color="primary" onClick={() => onTopScore(sum, i)} variant="outlined">
                        {`Add ${sum} Points`}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          }
        </TableBody>
      </Table>
    );
  }
}

export default ScoreTable;
