import { memo } from "react";
import MuiButton from "@mui/material/Button";

export interface ButtonProps {
  onClick: (name: string) => void;
  name: string;
}

const Button = memo(({ onClick, name }: ButtonProps) => (
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
