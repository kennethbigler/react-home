import { memo } from "react";
import { Button as MuiButton } from "@mui/material";
interface ButtonProps<T extends string> {
  onClick: (name: T) => void;
  name: T;
}

const Button = <T extends string>({ onClick, name }: ButtonProps<T>) => (
  <MuiButton
    onClick={(): void => onClick(name)}
    style={{ margin: 12 }}
    variant="contained"
  >
    {name}
  </MuiButton>
);

export default memo(Button) as typeof Button;
