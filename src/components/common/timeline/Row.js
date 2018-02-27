import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from './Segment';
// Parents: Degree

/** render code for each class */
export const Row = props => {
  const { segments } = props;
  const style = { marginTop: '10px' };
  return (
    <div style={style}>
      {segments.map((data, j) => <Segment key={j} data={data} />)}
    </div>
  );
};

Row.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  segments: PropTypes.array.isRequired
};
