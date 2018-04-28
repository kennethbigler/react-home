import React from 'react';
import { Cell } from './Cell';
import PropTypes from 'prop-types';
import { TableRow, TableRowColumn } from 'material-ui/Table';
// Parents: Help

/** render code for each class */
export const Row = props => {
  const { name, data } = props;
  console.log(data);
  return (
    <TableRow>
      <TableRowColumn style={{ textAlign: 'center', padding: 0 }}>
        {name}
      </TableRowColumn>
      {data.map((text, i) => <Cell key={i} {...text} />)}
    </TableRow>
  );
};

Row.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  name: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired
};
