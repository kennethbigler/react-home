import React, { memo } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DarkTableCell from '../../common/DarkTableCell';
import { SlotOptions } from '../../../apis/SlotMachine';

/** used to display the payout table */
const payoutTable = [
  { symbol: `${SlotOptions.JACKPOT} ${SlotOptions.JACKPOT} ${SlotOptions.JACKPOT}`, payout: 1666 },
  { symbol: `${SlotOptions.SEVEN} ${SlotOptions.SEVEN} ${SlotOptions.SEVEN}`, payout: 300 },
  { symbol: `${SlotOptions.TRIPLE_BAR} ${SlotOptions.TRIPLE_BAR} ${SlotOptions.TRIPLE_BAR}`, payout: 100 },
  { symbol: `${SlotOptions.DOUBLE_BAR} ${SlotOptions.DOUBLE_BAR} ${SlotOptions.DOUBLE_BAR}`, payout: 50 },
  { symbol: `${SlotOptions.BAR} ${SlotOptions.BAR} ${SlotOptions.BAR}`, payout: 25 },
  { symbol: '3 of any bar', payout: 12 },
  { symbol: `${SlotOptions.CHERRY} ${SlotOptions.CHERRY} ${SlotOptions.CHERRY}`, payout: 12 },
  { symbol: `${SlotOptions.CHERRY} ${SlotOptions.CHERRY}`, payout: 6 },
  { symbol: SlotOptions.CHERRY, payout: 3 },
];

const PayoutTable: React.FC<{}> = memo(() => (
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
