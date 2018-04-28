import React from 'react';
import PropTypes from 'prop-types';
import { Row } from './Row';
import { Cell } from './Cell';
import {
  Table,
  TableHeader,
  TableHeaderColumn,
  TableBody,
  TableRow
} from 'material-ui/Table';
// Parents: Popup

/** render code for each class */
export const BlackjackTable = props => {
  const { title, data } = props;
  const cards = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'A'];

  return (
    <Table>
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>
          <TableHeaderColumn colSpan="11">{title}</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        <TableRow>
          <Cell rowSpan="2" style={{ width: 60 }} text="Hand" />
          <Cell colSpan="10" text="Dealer" />
        </TableRow>
        <TableRow>{cards.map(c => <Cell key={c} text={c} />)}</TableRow>
        {data.map(obj => <Row key={obj.name} {...obj} />)}
      </TableBody>
    </Table>
  );
};

BlackjackTable.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
};
