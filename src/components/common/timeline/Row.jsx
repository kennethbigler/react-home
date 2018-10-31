import React from 'react';
import types from 'prop-types';
import map from 'lodash/map';
import Segment from './Segment';
import YearMarkers from './YearMarkers';
// Parents: Timeline

const Row = (props) => {
  const { segments, yearMarkers } = props;
  const style = yearMarkers
    ? { height: 0 }
    : { marginTop: '10px' };
  return (
    <div style={style}>
      {map(segments, (data, j) => (yearMarkers
        ? (<YearMarkers key={j} data={data} />)
        : (<Segment key={j} {...data} />)))
      }
    </div>
  );
};

Row.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  segments: types.arrayOf(types.object.isRequired).isRequired,
  yearMarkers: types.bool,
};

Row.defaultProps = {
  yearMarkers: false,
};

export default Row;
