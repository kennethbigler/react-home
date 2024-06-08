import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Cell from "./Cell";
import Row, { RowProps } from "./Row";

interface BlackjackTableProps {
  data: RowProps[];
  title: string;
}

const cards: string[] = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "A"];
const cellStyle: React.CSSProperties = { width: 60 };

const BlackjackTable: React.FC<BlackjackTableProps> = ({ title, data }) => (
  <Table aria-label={`ideal play strategy for ${title}`}>
    <TableHead>
      <TableRow>
        <TableCell colSpan={11}>{title}</TableCell>
      </TableRow>
      <TableRow>
        <Cell rowSpan={2} style={cellStyle} text="Hand" />
        <Cell colSpan={10} text="Dealer" />
      </TableRow>
      <TableRow>
        {cards.map((c) => (
          <Cell key={c} text={c} />
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map((obj) => (
        <Row key={obj.name} name={obj.name} data={obj.data} />
      ))}
    </TableBody>
  </Table>
);

export default BlackjackTable;
