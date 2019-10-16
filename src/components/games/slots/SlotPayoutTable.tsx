import React, { memo } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import map from 'lodash/map';
import DarkTableCell from '../../common/DarkTableCell';
import { payoutTable } from './SlotMachine';

const SlotPayoutTable: React.FC<{}> = memo(() => (
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
      { map(payoutTable, (row, i) => (
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

export default SlotPayoutTable;
