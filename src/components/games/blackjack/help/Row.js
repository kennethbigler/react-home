import React from 'react';
import { Cell } from './Cell';
import types from 'prop-types';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import map from 'lodash/map';
// Parents: Help

/** render code for each class */
export const Row = props => {
  const { name, data } = props;

  return (
    <TableRow>
      <TableRowColumn style={{ textAlign: 'center', padding: 0 }}>
        {name}
      </TableRowColumn>
      {map(data, (text, i) => <Cell key={i} {...text} />)}
    </TableRow>
  );
};

Row.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  data: types.arrayOf(types.object).isRequired,
  name: types.string.isRequired
};
