import React from 'react';
import types from 'prop-types';
import map from 'lodash/map';
import Segment from './Segment';
// Parents: Timeline

const Row = (props) => {
  const { segments } = props;
  const style = { marginTop: '10px' };
  return (
    <div style={style}>
      {map(segments, (data, j) => <Segment key={j} data={data} />)}
    </div>
  );
};

Row.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  segments: types.arrayOf(types.object.isRequired).isRequired,
};

export default Row;
