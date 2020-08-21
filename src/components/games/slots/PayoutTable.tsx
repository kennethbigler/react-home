import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DarkTableCell from '../../common/dark-table-cell/DarkTableCell';
import { DBSlotOptions as SO } from '../../../store/types';

/** used to display the payout table */
const payoutTable = [
  { symbol: `${SO.JACKPOT} ${SO.JACKPOT} ${SO.JACKPOT}`, payout: 1666 },
  { symbol: `${SO.SEVEN} ${SO.SEVEN} ${SO.SEVEN}`, payout: 300 },
  { symbol: `${SO.TRIPLE_BAR} ${SO.TRIPLE_BAR} ${SO.TRIPLE_BAR}`, payout: 100 },
  { symbol: `${SO.DOUBLE_BAR} ${SO.DOUBLE_BAR} ${SO.DOUBLE_BAR}`, payout: 50 },
  { symbol: `${SO.BAR} ${SO.BAR} ${SO.BAR}`, payout: 25 },
  { symbol: '3 of any bar', payout: 12 },
  { symbol: `${SO.CHERRY} ${SO.CHERRY} ${SO.CHERRY}`, payout: 12 },
  { symbol: `${SO.CHERRY} ${SO.CHERRY}`, payout: 6 },
  { symbol: SO.CHERRY, payout: 3 },
];

const PayoutTable: React.FC = React.memo(() => (
  <Table>
    <TableHead>
      <TableRow>
        <DarkTableCell>
          Slot Roll
        </DarkTableCell>
        <DarkTableCell>
          Payout
        </DarkTableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {payoutTable.map((row, i) => (
        <TableRow key={i}>
          <TableCell>
            { row.symbol }
          </TableCell>
          <TableCell>
            {`${row.payout} : 1`}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
));

export default PayoutTable;
