import { memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
interface MoneyTableProps {
  name: string;
  money: number;
  houseMoney: number;
}

const MoneyTable = memo(({ name, money, houseMoney }: MoneyTableProps) => (
  <Table aria-label="current slot game monetary status">
    <TableHead>
      <TableRow>
        <TableCell>Player</TableCell>
        <TableCell>Money</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell component="th" scope="row">
          {name}
        </TableCell>
        <TableCell>{`$${money}`}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          House
        </TableCell>
        <TableCell>{`$${houseMoney}`}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
));

MoneyTable.displayName = "MoneyTable";

export default MoneyTable;
