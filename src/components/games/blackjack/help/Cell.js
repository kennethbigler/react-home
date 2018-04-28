import React from 'react';
import PropTypes from 'prop-types';
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
  // PropTypes = [string, object, bool, number, func, array].isRequired
  color: PropTypes.string,
  text: PropTypes.string.isRequired,
  style: PropTypes.object
};
