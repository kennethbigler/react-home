import React from 'react';
import types from 'prop-types';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import map from 'lodash/map';
import Cell from './Cell';
// Parents: Help

const Row = (props) => {
  const { name, data } = props;

  return (
    <TableRow>
      <TableCell style={{ textAlign: 'center', padding: 0 }}>
        {name}
      </TableCell>
      {map(data, (text, i) => <Cell key={i} {...text} />)}
    </TableRow>
  );
};

Row.propTypes = {
  data: types.arrayOf(types.object).isRequired,
  name: types.string.isRequired,
};

export default Row;
