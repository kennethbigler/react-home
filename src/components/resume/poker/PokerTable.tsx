import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import map from 'lodash/map';
import chunk from 'lodash/chunk';
import sortBy from 'lodash/sortBy';
import { PokerScoreEntry } from '../../../constants/poker';

interface PokerTableProps {
  totals: PokerScoreEntry;
}

const cellStyles: React.CSSProperties = {
  paddingRight: 5,
  whiteSpace: 'nowrap',
};
const rowStyles: React.CSSProperties = {
  borderTop: '2px solid',
};

const PokerTable: React.FC<PokerTableProps> = (props: PokerTableProps) => {
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
          <TableCell colSpan={3}>Totals</TableCell>
        </TableRow>
      </TableHead>
      {map(tableRows, (row, i) => (
        <TableBody key={i} style={rowStyles}>
          <TableRow>
            {map(row, (obj) => (
              <TableCell key={obj.key} style={cellStyles}>{obj.key}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            {map(row, (obj) => (
              <TableCell key={obj.key} style={cellStyles}>{obj.val}</TableCell>
            ))}
          </TableRow>
        </TableBody>
      ))}
    </Table>
  );
};

export default PokerTable;
