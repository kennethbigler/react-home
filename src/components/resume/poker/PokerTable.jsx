import React from 'react';
import types from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import map from 'lodash/map';
import chunk from 'lodash/chunk';
import sortBy from 'lodash/sortBy';

const styles = {
  cell: {
    paddingRight: 5,
    whiteSpace: 'nowrap',
  },
  row: {
    borderTop: '2px solid',
  },
};

const PokerTable = (props) => {
  const { totals } = props;
  const tableRows = chunk(
    sortBy(
      map(totals, (val, key) => ({ key, val })),
      ['val'],
    ),
    4,
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell colSpan="3">Totals</TableCell>
        </TableRow>
      </TableHead>
      {map(tableRows, (row, i) => (
        <TableBody key={i} style={styles.row}>
          <TableRow>
            {map(row, obj => (
              <TableCell key={obj.key} style={styles.cell}>{obj.key}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            {map(row, obj => (
              <TableCell key={obj.key} style={styles.cell}>{obj.val}</TableCell>
            ))}
          </TableRow>
        </TableBody>
      ))}
    </Table>
  );
};

PokerTable.propTypes = {
  totals: types.objectOf(types.number).isRequired,
};

export default PokerTable;
