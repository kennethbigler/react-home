import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DarkTableCell from '../../common/DarkTableCell';

interface MoneyTableProps {
  playerName: string;
  playerMoney: number;
  dealerMoney: number;
}

const MoneyTable: React.FC<MoneyTableProps> = React.memo(({ playerName, playerMoney, dealerMoney }: MoneyTableProps) => (
  <Table>
    <TableHead>
      <TableRow>
        <DarkTableCell>
          Player
        </DarkTableCell>
        <DarkTableCell>
          Money
        </DarkTableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>
          {playerName}
        </TableCell>
        <TableCell>
          {`$${playerMoney}`}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          House
        </TableCell>
        <TableCell>
          {`$${dealerMoney}`}
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
));

export default MoneyTable;
