import * as React from "react";
import { grey } from "@mui/material/colors";

interface PopoverProps {
  x: number;
  y: number;
  hide: boolean;
  content: string;
}

const Popover: React.FC<PopoverProps> = React.memo((props: PopoverProps) => {
  const { x, y, hide, content } = props;

  const popoverStyle: React.CSSProperties = React.useMemo(
    () => ({
      position: "absolute",
      left: x + 2,
      top: y - 35,
      display: hide ? "none" : "block",
      backgroundColor: grey[800],
      color: "white",
      padding: 5,
      borderRadius: 2,
    }),
    [hide, x, y],
  );

  return <div style={popoverStyle}>{content}</div>;
});

export default Popover;
