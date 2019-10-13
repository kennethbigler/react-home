import React, { memo } from 'react';
import MuiButton from '@material-ui/core/Button';
import { PropTypes } from '@material-ui/core/';
// Parents: ButtonGroup

export interface ButtonProps {
  func: Function;
  name: string;
}

const Button = memo((props: ButtonProps) => {
  const { func, name } = props;

  const buttonStyle: React.CSSProperties = { margin: 12 };
  const color: PropTypes.Color = 'primary';

  return (
    <MuiButton
      color={color}
      onClick={func as any}
      style={buttonStyle}
      variant="contained"
    >
      {name}
    </MuiButton>
  );
});

export default Button;
