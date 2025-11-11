import { CSSProperties } from "react";
import Cell from "./Cell";
import Row, { RowProps } from "./Row";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

interface BlackjackTableProps {
  data: RowProps[];
  title: string;
}

const cards: string[] = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "A"];
const cellStyle: CSSProperties = { width: 60 };

const BlackjackTable = ({ title, data }: BlackjackTableProps) => (
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
