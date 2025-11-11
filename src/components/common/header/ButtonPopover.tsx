import {
  useState,
  MouseEventHandler,
  MouseEvent,
  CSSProperties,
  ReactElement,
} from "react";
import { Button, Popover } from "@mui/material";

interface AnchorElHook {
  anchorEl: null | HTMLElement;
  setAnchor: MouseEventHandler;
  clearAnchor: MouseEventHandler;
}

const useAnchorEl = (): AnchorElHook => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const setAnchor = (e: MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(e.currentTarget);
  };
  const clearAnchor = (): void => {
    setAnchorEl(null);
  };
  return { anchorEl, setAnchor, clearAnchor };
};

interface ButtonPopoverProps {
  children: ReactElement;
  buttonText: string;
}

const contentStyle: CSSProperties = { padding: 15 };

const ButtonPopover = ({ children, buttonText }: ButtonPopoverProps) => {
  const { anchorEl, setAnchor, clearAnchor } = useAnchorEl();
  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        aria-haspopup="true"
        variant="contained"
        component="button"
        onClick={setAnchor}
      >
        {buttonText}
      </Button>
      <Popover
        id="player-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={clearAnchor}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        title="player-popover"
      >
        <div style={contentStyle}>{children}</div>
      </Popover>
    </>
  );
};

export default ButtonPopover;
