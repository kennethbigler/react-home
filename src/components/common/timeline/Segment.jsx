import React from 'react';
import types from 'prop-types';
import grey from '@material-ui/core/colors/grey';
// Parents: Row

const styles = {
  box: {
    cursor: 'default',
    paddingTop: '5px',
    paddingBottom: '5px',
    boxShadow: `2px 3px 4px ${grey[400]}`,
    color: grey[50],
    textAlign: 'center',
  },
};

const Segment = (props) => {
  // var for segment
  const {
    data: {
      company, width, color, title,
    },
  } = props;
  // variables for empty segment
  let style = { display: 'inline-block', width: `${width}%` };
  let body = <br />;
  // company for company
  if (company) {
    style = { ...style, ...styles.box, backgroundColor: color };
    body = company;
  }

  return (
    <div style={style} title={title}>
      {body}
    </div>
  );
};

Segment.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  data: types.shape({
    color: types.any,
    company: types.any,
    title: types.any,
    width: types.any.isRequired,
  }).isRequired,
};

export default Segment;
