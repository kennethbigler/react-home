import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const containerStyles: React.CSSProperties = {
  display: 'block',
  margin: 'auto',
  marginTop: 40,
};

const LoadingSpinner = React.memo(() => (
  <CircularProgress size={100} style={containerStyles} title="Loading Spinner" />
));

export default LoadingSpinner;
