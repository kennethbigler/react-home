import React from 'react';
import { Cell } from './Cell';
import PropTypes from 'prop-types';
import { TableRow, TableRowColumn } from 'material-ui/Table';
// Parents: Help

/** render code for each class */
export const Row = props => {
  const { name, data } = props;
  const style = {
    textAlign: 'center',
    padding: 0
  };
  return (
    <TableRow>
      <TableRowColumn style={style}>{name}</TableRowColumn>
      {data.map((action, i) => <Cell key={i} {...action} style={style} />)}
    </TableRow>
  );
};

Row.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  name: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired
};
