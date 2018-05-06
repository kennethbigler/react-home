import React from 'react';
import types from 'prop-types';
import { Segment } from './Segment';
import map from 'lodash/map';
// Parents: Timeline

/** render code for each class */
export const Row = props => {
  const { segments } = props;
  const style = { marginTop: '10px' };
  return (
    <div style={style}>
      {map(segments, (data, j) => <Segment data={data} key={j} />)}
    </div>
  );
};

Row.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  segments: types.arrayOf(types.object.isRequired).isRequired
};
