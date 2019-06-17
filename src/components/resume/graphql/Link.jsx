import React from 'react';
import types from 'prop-types';

const Link = ({ children, ...props }) => (
  <a {...props} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

Link.propTypes = {
  children: types.node,
};

export default Link;
