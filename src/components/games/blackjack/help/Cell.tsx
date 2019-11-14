import React from 'react';
import TableCell from '@material-ui/core/TableCell';

export interface CellProps {
  color?: string;
  style?: React.CSSProperties;
  text: string;
  rowSpan?: number;
  colSpan?: number;
}

const Cell: React.FC<CellProps> = React.memo((props: CellProps) => {
  const {
    color, text, style, ...otherProps
  } = props;

  const stl: React.CSSProperties = {
    ...style,
    textAlign: 'center',
    backgroundColor: color,
  };

  return (
    <TableCell size="small" style={stl} {...otherProps}>
      {text}
    </TableCell>
  );
});

export default Cell;
