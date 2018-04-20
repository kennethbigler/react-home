import React from 'react';
import PropTypes from 'prop-types';
import { Row } from './Row';
import {
  Table,
  TableHeader,
  TableHeaderColumn,
  TableBody,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
// Parents: Popup

/** render code for each class */
export const BlackjackTable = props => {
  const { title, data } = props;

  const cards = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'A'];
  const style = {
    width: 75,
    textAlign: 'center',
    padding: 0
  };

  return (
    <Table>
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>
          <TableHeaderColumn colSpan="11">{title}</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        <TableRow>
          <TableRowColumn rowSpan="2" style={style}>
            Your<br />Hand
          </TableRowColumn>
          <TableRowColumn colSpan="10">Dealer</TableRowColumn>
        </TableRow>
        <TableRow>
          {cards.map(c => <TableRowColumn key={c}>{c}</TableRowColumn>)}
        </TableRow>
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
