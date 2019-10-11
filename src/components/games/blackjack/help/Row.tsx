import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import map from 'lodash/map';
import Cell, { CellProps } from './Cell';

export interface RowProps {
  data: CellProps[];
  name: string;
}

const tableCellStyle: React.CSSProperties = { textAlign: 'center', padding: 0 };

const Row: React.FC<RowProps> = (props: RowProps) => {
  const { name, data } = props;

  return (
    <TableRow>
      <TableCell style={tableCellStyle}>
        {name}
      </TableCell>
      {map(data, (text, i) => <Cell key={i} {...text} />)}
    </TableRow>
  );
};

export default Row;
