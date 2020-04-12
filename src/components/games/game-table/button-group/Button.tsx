import React from 'react';
import MuiButton from '@material-ui/core/Button';
import { PropTypes } from '@material-ui/core/';

const buttonStyle: React.CSSProperties = { margin: 12 };
const color: PropTypes.Color = 'primary';

export interface ButtonProps {
  onClick: (name: string) => void;
  name: string;
}

const Button: React.FC<ButtonProps> = React.memo(({ onClick, name }: ButtonProps) => (
  <MuiButton
    color={color}
    onClick={(): void => onClick(name)}
    style={buttonStyle}
    variant="contained"
  >
    {name}
  </MuiButton>
));

export default Button;
