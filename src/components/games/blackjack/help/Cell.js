import React from 'react';
import types from 'prop-types';
import { TableRowColumn } from 'material-ui/Table';
// Parents: Help

/** render code for each class */
export const Cell = props => {
  const { color, text, style, ...otherProps } = props;
  const stl = {
    ...style,
    textAlign: 'center',
    padding: 0,
    backgroundColor: color
  };
  return (
    <TableRowColumn style={stl} {...otherProps}>
      {text}
    </TableRowColumn>
  );
};

Cell.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  color: types.string,
  style: types.objectOf(types.oneOfType([types.string, types.number])),
  text: types.string.isRequired
};
