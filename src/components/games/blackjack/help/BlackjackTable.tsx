import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import map from 'lodash/map';
import Cell from './Cell';
import Row, { RowProps } from './Row';

interface BlackjackTable {
  data: RowProps[];
  title: string;
}

const cards: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'A'];
const cellStyle: React.CSSProperties = { width: 60 };

const BlackjackTable: React.FC<BlackjackTable> = (props: BlackjackTable) => {
  const { title, data } = props;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell colSpan={11}>
            {title}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <Cell rowSpan={2} style={cellStyle} text="Hand" />
          <Cell colSpan={10} text="Dealer" />
        </TableRow>
        <TableRow>
          {map(cards, (c) => <Cell key={c} text={c} />)}
        </TableRow>
        {map(data, (obj) => <Row key={obj.name} name={obj.name} data={obj.data} />)}
      </TableBody>
    </Table>
  );
};

export default BlackjackTable;
