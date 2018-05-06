import React from 'react';
import types from 'prop-types';
import { grey50, grey400 } from 'material-ui/styles/colors';
// Parents: Row

const styles = {
  box: {
    cursor: 'default',
    paddingTop: '5px',
    paddingBottom: '5px',
    boxShadow: `2px 3px 4px ${grey400}`,
    color: grey50,
    textAlign: 'center'
  }
};

/** render code for each class */
export const Segment = props => {
  // var for segment
  const { company, width, color, title } = props.data;
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
    company: types.any,
    width: types.any.isRequired,
    color: types.any,
    title: types.any
  }).isRequired
};
