import React from 'react';
import types from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import map from 'lodash/map';
import Cell from './Cell';
import Row from './Row';
// Parents: Popup

const BlackjackTable = (props) => {
  const { title, data } = props;
  const cards = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'A'];

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell colSpan="11">
            {title}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <Cell rowSpan="2" style={{ width: 60 }} text="Hand" />
          <Cell colSpan="10" text="Dealer" />
        </TableRow>
        <TableRow>
          {map(cards, (c) => <Cell key={c} text={c} />)}
        </TableRow>
        {map(data, (obj) => <Row key={obj.name} {...obj} />)}
      </TableBody>
    </Table>
  );
};

BlackjackTable.propTypes = {
  data: types.arrayOf(
    types.shape({
      name: types.string.isRequired,
    }),
  ).isRequired,
  title: types.string.isRequired,
};

export default BlackjackTable;
