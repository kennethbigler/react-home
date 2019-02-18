import React from 'react';

const ErrorMessage = ({ error }) => (
  <div>
    <small>{error.toString()}</small>
  </div>
);

export default ErrorMessage;
