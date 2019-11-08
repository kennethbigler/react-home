import React, { memo } from 'react';
import MuiButton from '@material-ui/core/Button';
import { PropTypes } from '@material-ui/core/';

const buttonStyle: React.CSSProperties = { margin: 12 };
const color: PropTypes.Color = 'primary';

export interface ButtonProps {
  func: React.MouseEventHandler;
  name: string;
}

const Button: React.FC<ButtonProps> = memo(({ func, name }: ButtonProps) => (
  <MuiButton
    color={color}
    onClick={func}
    style={buttonStyle}
    variant="contained"
  >
    {name}
  </MuiButton>
));

export default Button;
