import * as React from "react";
import TableCell from "@mui/material/TableCell";

export interface CellProps {
  color?: string;
  style?: React.CSSProperties;
  text: string;
  rowSpan?: number;
  colSpan?: number;
}

const Cell: React.FC<CellProps> = React.memo((props: CellProps) => {
  const { color, text, style, ...otherProps } = props;

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
});

export default Cell;
