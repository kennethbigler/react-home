import React from 'react';
import types from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
// Parents: Help

const Cell = (props) => {
  const {
    color, text, style, ...otherProps
  } = props;
  const stl = {
    ...style,
    textAlign: 'center',
    backgroundColor: color,
  };
  return (
    <TableCell size="small" style={stl} {...otherProps}>
      {text}
    </TableCell>
  );
};

Cell.propTypes = {
  color: types.string,
  style: types.objectOf(types.oneOfType([types.string, types.number])),
  text: types.string.isRequired,
};

export default Cell;
