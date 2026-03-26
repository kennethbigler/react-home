import { memo, CSSProperties } from "react";
import { useTheme } from "@mui/material/styles";
import { Button } from "@mui/material";

interface CellProps {
  cellIndex: number;
  onClick: (cellIndex: number) => void;
  value: string | null;
  winner: boolean;
}

const Cell = memo(({ cellIndex, value, winner, onClick }: CellProps) => {
  const {
    palette: {
      primary: { main },
    },
  } = useTheme();
  // add attributes if cell is a winner
  const attr: CSSProperties = winner
    ? { color: "white", backgroundColor: main }
    : {};

  return (
    <Button
      onClick={() => onClick(cellIndex)}
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
