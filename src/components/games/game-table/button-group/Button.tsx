import React from "react";
import MuiButton from "@mui/material/Button";

const buttonStyle: React.CSSProperties = { margin: 12, color: "black" };

export interface ButtonProps {
  onClick: (name: string) => void;
  name: string;
}

const Button: React.FC<ButtonProps> = React.memo(
  ({ onClick, name }: ButtonProps) => (
    <MuiButton
      color="primary"
      onClick={(): void => onClick(name)}
      style={buttonStyle}
      variant="contained"
    >
      {name}
    </MuiButton>
  )
);

export default Button;
