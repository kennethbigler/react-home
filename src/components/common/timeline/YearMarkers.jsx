import React from 'react';
import types from 'prop-types';
import grey from '@material-ui/core/colors/grey';
// Parents: Row

const styles = {
  box: {
    cursor: 'default',
    backgroundColor: grey[300],
    height: '160px',
    marginBottom: '-160px',
  },
};

const YearMarkers = (props) => {
  // var for segment
  const { data: { company, width } } = props;
  // variables for empty segment
  let style = { display: 'inline-block', width: `${width}%` };
  let body = <br />;
  // company for company
  if (company) {
    style = { ...style, ...styles.box };
    body = company;
  }

  return (
    <div style={style}>
      {body}
    </div>
  );
};

YearMarkers.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  data: types.shape({
    color: types.any,
    company: types.any,
    title: types.any,
    width: types.any.isRequired,
  }).isRequired,
};

export default YearMarkers;
