import React, { memo } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  container: {
    display: 'block',
    margin: 'auto',
    marginTop: 40,
  },
};

const LoadingSpinner = memo(() => (
  <CircularProgress size={100} style={styles.container} />
));

export default LoadingSpinner;
