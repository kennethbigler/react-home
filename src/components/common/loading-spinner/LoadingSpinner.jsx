import React, { memo } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './LoadingSpinner.styles';

const LoadingSpinner = memo(() => (
  <CircularProgress size={100} style={styles.container} />
));

export default LoadingSpinner;
