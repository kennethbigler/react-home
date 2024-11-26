import * as React from "react";
import MuiButton from "@mui/material/Button";

export interface ButtonProps {
  onClick: (name: string) => void;
  name: string;
}

const Button = React.memo(({ onClick, name }: ButtonProps) => (
  <MuiButton
    onClick={(): void => onClick(name)}
    style={{ margin: 12 }}
    variant="contained"
  >
    {name}
  </MuiButton>
));

Button.displayName = "Button";

export default Button;
