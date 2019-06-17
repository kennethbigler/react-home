import React from 'react';
import types from 'prop-types';

const ErrorMessage = ({ error }) => (
  <div>
    <small>{error.toString()}</small>
  </div>
);

ErrorMessage.propTypes = {
  error: types.shape({}).isRequired,
};

export default ErrorMessage;
