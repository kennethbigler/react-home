import React, { memo } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const containerStyles: React.CSSProperties = {
  display: 'block',
  margin: 'auto',
  marginTop: 40,
};

const LoadingSpinner = memo(() => (
  <CircularProgress size={100} style={containerStyles} />
));

export default LoadingSpinner;
