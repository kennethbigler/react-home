import { CSSProperties } from "react";
import Cell, { CellProps } from "./Cell";
import { TableRow, TableCell } from "@mui/material";

export interface RowProps {
  data: CellProps[];
  name: string;
}

const tableCellStyle: CSSProperties = { textAlign: "center", padding: 0 };

const Row = ({ name, data }: RowProps) => (
  <TableRow>
    <TableCell style={tableCellStyle} component="th" scope="row">
      {name}
    </TableCell>
    {data.map((text, i) => (
      <Cell key={i} {...text} />
    ))}
  </TableRow>
);

export default Row;
