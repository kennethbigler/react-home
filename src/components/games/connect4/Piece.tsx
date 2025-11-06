import { MouseEventHandler, memo, CSSProperties } from "react";
import ContentAdd from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import { red, lightGreen } from "@mui/material/colors";

interface PieceProps {
  /** aria label */
  ariaLabel?: string;
  /** can the piece be clicked? */
  enabled?: boolean;
  /** callback onClick of piece */
  onClick?: MouseEventHandler;
  /** type of piece */
  piece: number;
}

/** returns color based of piece type */
const getColor = (piece: number): string | undefined => {
  switch (piece) {
    case 0:
      return undefined;
    case 1:
      return red[500];
    case 2:
      return "black";
    default:
      return lightGreen[600];
  }
};

const Piece = memo(
  ({ ariaLabel, piece, enabled = false, onClick }: PieceProps) => {
    const color = getColor(piece);
    const style: CSSProperties = { backgroundColor: color };

    return !enabled ? (
      <Fab
        disabled
        size="small"
        style={style}
        aria-label="disabled column input"
      >
        <div />
      </Fab>
    ) : (
      <Fab
        size="small"
        onClick={onClick}
        style={style}
        role="button"
        aria-label={ariaLabel}
      >
        <ContentAdd style={{ color: "white" }} />
      </Fab>
    );
  },
);

Piece.displayName = "Piece";

export default Piece;
