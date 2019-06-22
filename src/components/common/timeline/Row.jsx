import React from 'react';
import types from 'prop-types';
import map from 'lodash/map';
import Segment from './Segment';
import YearMarkers from './YearMarkers';
// Parents: Timeline

const Row = (props) => {
  const { segments, yearMarkers, first } = props;

  let style = { marginTop: 10 };
  if (yearMarkers) {
    style = { height: 0 };
  } else if (first) {
    style = { marginTop: 20 };
  }

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
  first: types.bool,
};

Row.defaultProps = {
  yearMarkers: false,
  first: false,
};

export default Row;
