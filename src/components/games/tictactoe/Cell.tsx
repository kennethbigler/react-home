import * as React from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

interface CellProps {
  onClick: React.MouseEventHandler;
  value: string | null;
  winner: boolean;
}

const Cell = React.memo(({ value, winner, onClick }: CellProps) => {
  const {
    palette: {
      primary: { main },
    },
  } = useTheme();
  // add attributes if cell is a winner
  const attr: React.CSSProperties = winner
    ? { color: "white", backgroundColor: main }
    : {};

  return (
    <Button
      onClick={onClick}
      style={attr}
      aria-label={`Tic Tac Toe Play Button ${
        value ? `${value} selected` : "available"
      }`}
    >
      {value || <br />}
    </Button>
  );
});

Cell.displayName = "Cell";

export default Cell;
