import React from 'react';
import types from 'prop-types';
import grey from '@material-ui/core/colors/grey';
// Parents: Row

const styles = {
  box: {
    cursor: 'default',
    backgroundColor: grey[200],
    height: 500,
    marginBottom: -500,
    minWidth: 1,
  },
  label: {
    position: 'relative',
    right: 22,
  },
};

const YearMarkers = (props) => {
  // var for segment
  const { data: { body, width } } = props;
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
