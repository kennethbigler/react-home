import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface MoneyTableProps {
  name: string;
  money: number;
  houseMoney: number;
}

const MoneyTable: React.FC<MoneyTableProps> = React.memo(
  ({ name, money, houseMoney }: MoneyTableProps) => (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Player</TableCell>
          <TableCell>Money</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>{name}</TableCell>
          <TableCell>{`$${money}`}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>House</TableCell>
          <TableCell>{`$${houseMoney}`}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
);

export default MoneyTable;
