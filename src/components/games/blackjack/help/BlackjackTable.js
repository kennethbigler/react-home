import React from 'react';
import types from 'prop-types';
import { Row } from './Row';
import { Cell } from './Cell';
import {
  Table,
  TableHeader,
  TableHeaderColumn,
  TableBody,
  TableRow
} from 'material-ui/Table';
import map from 'lodash/map';
// Parents: Popup

/** render code for each class */
export const BlackjackTable = props => {
  const { title, data } = props;
  const cards = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'A'];

  return (
    <Table>
      <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
        <TableRow>
          <TableHeaderColumn colSpan="11">{title}</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        <TableRow>
          <Cell rowSpan="2" style={{ width: 60 }} text="Hand" />
          <Cell colSpan="10" text="Dealer" />
        </TableRow>
        <TableRow>{map(cards, c => <Cell key={c} text={c} />)}</TableRow>
        {map(data, obj => <Row key={obj.name} {...obj} />)}
      </TableBody>
    </Table>
  );
};

BlackjackTable.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  data: types.arrayOf(
    types.shape({
      name: types.string.isRequired
    })
  ).isRequired,
  title: types.string.isRequired
};
