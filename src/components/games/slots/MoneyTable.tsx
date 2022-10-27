import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface MoneyTableProps {
  playerName: string;
  playerMoney: number;
  dealerMoney: number;
}

const MoneyTable: React.FC<MoneyTableProps> = React.memo(
  ({ playerName, playerMoney, dealerMoney }: MoneyTableProps) => (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Player</TableCell>
          <TableCell>Money</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>{playerName}</TableCell>
          <TableCell>{`$${playerMoney}`}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>House</TableCell>
          <TableCell>{`$${dealerMoney}`}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
);

export default MoneyTable;
