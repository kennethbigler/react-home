import React from 'react';
import PropTypes from 'prop-types';
import { TableRowColumn } from 'material-ui/Table';
// Parents: Help

/** render code for each class */
export const Cell = props => {
  const { color, action, style, ...otherProps } = props;
  const stl = { ...style, backgroundColor: color };
  return (
    <TableRowColumn style={stl} {...otherProps}>
      {action}
    </TableRowColumn>
  );
};

Cell.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  color: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  style: PropTypes.object
};
