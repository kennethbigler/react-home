import React, { memo } from 'react';
import MuiButton from '@material-ui/core/Button';
import { PropTypes } from '@material-ui/core/';
// Parents: ButtonGroup

export interface ButtonProps {
  func: React.MouseEventHandler;
  name: string;
}

const Button = memo((props: ButtonProps) => {
  const { func, name } = props;

  const buttonStyle: React.CSSProperties = { margin: 12 };
  const color: PropTypes.Color = 'primary';

  return (
    <MuiButton
      color={color}
      onClick={func}
      style={buttonStyle}
      variant="contained"
    >
      {name}
    </MuiButton>
  );
});

export default Button;
