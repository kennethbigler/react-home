import { memo } from "react";
import { SlotOption as SO } from "./slotMachine";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

/** used to display the payout table */
const payoutTable = [
  { symbol: `${SO.JACKPOT} ${SO.JACKPOT} ${SO.JACKPOT}`, payout: 1666 },
  { symbol: `${SO.SEVEN} ${SO.SEVEN} ${SO.SEVEN}`, payout: 300 },
  { symbol: `${SO.TRIPLE_BAR} ${SO.TRIPLE_BAR} ${SO.TRIPLE_BAR}`, payout: 100 },
  { symbol: `${SO.DOUBLE_BAR} ${SO.DOUBLE_BAR} ${SO.DOUBLE_BAR}`, payout: 50 },
  { symbol: `${SO.BAR} ${SO.BAR} ${SO.BAR}`, payout: 25 },
  {
    symbol: `3 of any ${SO.BAR} ${SO.DOUBLE_BAR} ${SO.TRIPLE_BAR}`,
    payout: 12,
  },
  { symbol: `${SO.CHERRY} ${SO.CHERRY} ${SO.CHERRY}`, payout: 12 },
  { symbol: `${SO.CHERRY} ${SO.CHERRY}`, payout: 6 },
  { symbol: SO.CHERRY, payout: 3 },
];

const PayoutTable = memo(() => (
  <Table aria-label="payout reference table for slot game">
    <TableHead>
      <TableRow>
        <TableCell>Slot Roll</TableCell>
        <TableCell>Payout</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {payoutTable.map((row, i) => (
        <TableRow key={i}>
          <TableCell component="th" scope="row">
            {row.symbol}
          </TableCell>
          <TableCell>{`${row.payout} : 1`}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
));

PayoutTable.displayName = "PayoutTable";

export default PayoutTable;
