import React from 'react';
import PropTypes from 'prop-types';
import { grey50 } from 'material-ui/styles/colors';
// Parents: Degree

const styles = {
  box: {
    cursor: 'default',
    paddingTop: '5px',
    paddingBottom: '5px',
    boxShadow: '2px 3px 4px #999',
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
    <div title={title} style={style}>
      {body}
    </div>
  );
};

Segment.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  data: PropTypes.object.isRequired
};
