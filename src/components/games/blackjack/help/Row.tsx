import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Cell, { CellProps } from "./Cell";

export interface RowProps {
  data: CellProps[];
  name: string;
}

const tableCellStyle: React.CSSProperties = { textAlign: "center", padding: 0 };

const Row: React.FC<RowProps> = ({ name, data }: RowProps) => (
  <TableRow>
    <TableCell style={tableCellStyle}>{name}</TableCell>
    {data.map((text, i) => (
      <Cell key={i} {...text} />
    ))}
  </TableRow>
);

export default Row;
