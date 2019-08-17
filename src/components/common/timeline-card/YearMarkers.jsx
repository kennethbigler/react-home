import React from 'react';
import types from 'prop-types';
import styles from './YearMarkers.styles';
// Parents: Row

const YearMarkers = (props) => {
  // var for segment
  const { data: { body, width }} = props;
  // variables for empty segment
  let style = { display: 'inline-block', width: `${width}%` };
  if (body) {
    style = { ...style, ...styles.box };
  }

  return (
    <div style={style}>
      {body ? (
        <div style={styles.label}>
          {body}
        </div>
      ) : (<br />)}
    </div>
  );
};

YearMarkers.propTypes = {
  data: types.shape({
    color: types.any,
    body: types.any,
    title: types.any,
    width: types.any.isRequired,
  }).isRequired,
};

export default YearMarkers;
