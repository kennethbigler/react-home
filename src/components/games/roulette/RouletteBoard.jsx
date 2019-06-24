import React, { Component } from 'react';
import types from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import map from 'lodash/map';
// Parents: Popup

class RouletteBoard extends Component {
  renderCells = (c) => {
    const { onClick } = this.props;
    return <TableCell key={c} text={c} onClick={onClick(c)} />;
  };

  renderRows = row => (
    <TableRow>
      {map(row, this.renderCells)}
    </TableRow>
  )

  render() {
    const rows = [
      ['00', 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, '2-1'],
      ['00 / 0', 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, '2-1'],
      ['0', 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, '2-1'],
      ['1st 12', '2nd 12', '3rd 12'],
      ['1-18', 'Even', 'Red', 'Black', 'Odd', '19-36'],
    ];

    return (
      <Table>

        <TableHead>
          <TableRow>
            <TableCell>
              Roulette
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {map(rows, this.renderRows)}
          <TableRow>
            <TableCell text="Red: ~48%" />
            <TableCell text="Black: ~48%" />
            <TableCell text="Zeros: ~4%" />
            <TableCell text="Casino Profit: $400" />
          </TableRow>
        </TableBody>

      </Table>
    );
  }
}

RouletteBoard.propTypes = {
  onClick: types.func.isRequired,
};

export default RouletteBoard;
