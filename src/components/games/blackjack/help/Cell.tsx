import * as React from "react";
import TableCell from "@mui/material/TableCell";

export interface CellProps {
  color?: string;
  style?: React.CSSProperties;
  text: string;
  rowSpan?: number;
  colSpan?: number;
}

const Cell = ({ color, text, style, ...otherProps }: CellProps) => {
  const stl: React.CSSProperties = {
    ...style,
    textAlign: "center",
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: color,
  };

  return (
    <TableCell size="small" style={stl} {...otherProps}>
      {text}
    </TableCell>
  );
};

Cell.displayName = "Cell";

export default Cell;
