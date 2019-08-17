import React, { memo } from 'react';
import types from 'prop-types';
import grey from '@material-ui/core/colors/grey';

const Popover = memo((props) => {
  const {
    x, y, hide, content,
  } = props;

  const popoverStyle = {
    position: 'absolute',
    left: x + 2,
    top: y - 35,
    display: hide ? 'none' : 'block',
    backgroundColor: grey[800],
    color: 'white',
    padding: 5,
    borderRadius: 2,
  };


  return (
    <div style={popoverStyle}>{content}</div>
  );
});

Popover.propTypes = {
  x: types.number.isRequired,
  y: types.number.isRequired,
  hide: types.bool.isRequired,
  content: types.string.isRequired,
};

export default Popover;
