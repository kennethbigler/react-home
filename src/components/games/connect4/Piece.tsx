import React from "react";
import ContentAdd from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import { red, lightGreen } from "@mui/material/colors";

import noop from "../../../apis/noop";

interface PieceProps {
  /** can the piece be clicked? */
  enabled?: boolean;
  /** callback onClick of piece */
  onClick?: React.MouseEventHandler;
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

const Piece = (props: PieceProps): React.ReactElement => {
  const { piece, enabled = false, onClick = noop } = props;

  const color = getColor(piece);
  const style: React.CSSProperties = { backgroundColor: color };

  return !enabled ? (
    <Fab disabled size="small" style={style}>
      <div />
    </Fab>
  ) : (
    <Fab size="small" onClick={onClick} style={style} role="button">
      <ContentAdd style={{ color: "white" }} />
    </Fab>
  );
};

export default React.memo(Piece);
