// react
import { memo } from "react";
// material-ui
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { green, teal, red, orange, deepPurple } from "@mui/material/colors";
// components
import Cell, { CellProps } from "./Cell";
import { RowProps } from "./Row";
import BlackjackTable from "./BlackjackTable";
// Parents: blackjack/Header

/* Help  ->  BlackJackTable  ->  Row  -->  Cell */
const Help = memo(() => {
  // options
  const h: CellProps = { color: green[200], text: "H" };
  const d: CellProps = { color: teal[200], text: "D" };
  const s: CellProps = { color: red[200], text: "S" };
  const p: CellProps = { color: orange[200], text: "P" };
  const ds: CellProps = { color: deepPurple[200], text: "DS" };

  // algorithms for options
  const hardTtl: RowProps[] = [
    { name: "Hard 5", data: [h, h, h, h, h, h, h, h, h, h] },
    { name: "Hard 6", data: [h, h, h, h, h, h, h, h, h, h] },
    { name: "Hard 7", data: [h, h, h, h, h, h, h, h, h, h] },
    { name: "Hard 8", data: [h, h, h, h, h, h, h, h, h, h] },
    { name: "Hard 9", data: [h, d, d, d, d, h, h, h, h, h] },
    { name: "Hard 10", data: [d, d, d, d, d, d, d, d, h, h] },
    { name: "Hard 11", data: [d, d, d, d, d, d, d, d, d, d] },
    { name: "Hard 12", data: [h, h, s, s, s, h, h, h, h, h] },
    { name: "Hard 13", data: [s, s, s, s, s, h, h, h, h, h] },
    { name: "Hard 14", data: [s, s, s, s, s, h, h, h, h, h] },
    { name: "Hard 15", data: [s, s, s, s, s, h, h, h, h, h] },
    { name: "Hard 16", data: [s, s, s, s, s, h, h, h, h, h] },
    { name: "Hard 17", data: [s, s, s, s, s, s, s, s, s, s] },
    { name: "Hard 18+", data: [s, s, s, s, s, s, s, s, s, s] },
  ];
  const softTtl: RowProps[] = [
    { name: "Ace + 2", data: [h, h, h, d, d, h, h, h, h, h] },
    { name: "Ace + 3", data: [h, h, h, d, d, h, h, h, h, h] },
    { name: "Ace + 4", data: [h, h, d, d, d, h, h, h, h, h] },
    { name: "Ace + 5", data: [h, h, d, d, d, h, h, h, h, h] },
    { name: "Ace + 6", data: [h, d, d, d, d, h, h, h, h, h] },
    { name: "Ace + 7", data: [ds, ds, ds, ds, ds, s, s, h, h, h] },
    { name: "Ace + 8", data: [s, s, s, s, ds, s, s, s, s, s] },
    { name: "Ace + 9", data: [s, s, s, s, s, s, s, s, s, s] },
  ];
  const pairs: RowProps[] = [
    { name: "(2,2)", data: [p, p, p, p, p, p, h, h, h, h] },
    { name: "(3,3)", data: [p, p, p, p, p, p, h, h, h, h] },
    { name: "(4,4)", data: [h, h, h, p, p, h, h, h, h, h] },
    { name: "(5,5)", data: [d, d, d, d, d, d, d, d, h, h] },
    { name: "(6,6)", data: [p, p, p, p, p, h, h, h, h, h] },
    { name: "(7,7)", data: [p, p, p, p, p, p, h, h, h, h] },
    { name: "(8,8)", data: [p, p, p, p, p, p, p, p, p, p] },
    { name: "(9,9)", data: [p, p, p, p, p, s, p, p, s, s] },
    { name: "(T,T)", data: [s, s, s, s, s, s, s, s, s, s] },
    { name: "(A,A)", data: [p, p, p, p, p, p, p, p, p, p] },
  ];

  return (
    <>
      <BlackjackTable data={hardTtl} title="Hard Totals" />
      <BlackjackTable data={softTtl} title="Soft Totals" />
      <BlackjackTable data={pairs} title="Pairs" />
      <Table aria-label="Key for above: H means Hit, S means Stand, P means Split, D means Double or Hit, DS means Double or Split">
        <TableHead>
          <TableRow>
            <TableCell colSpan={11}>Key</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <Cell {...h} />
            <Cell colSpan={2} text="= Hit" />
            <Cell {...s} />
            <Cell colSpan={3} text="= Stand" />
            <Cell {...p} />
            <Cell colSpan={3} text="= Split" />
          </TableRow>
          <TableRow>
            <Cell {...d} />
            <Cell colSpan={10} text="= Double (Hit if not allowed)" />
          </TableRow>
          <TableRow>
            <Cell {...ds} />
            <Cell colSpan={10} text="= Double (Stand if not allowed)" />
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
});

Help.displayName = "Help";

export default Help;
