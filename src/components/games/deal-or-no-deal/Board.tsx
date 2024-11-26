import * as React from "react";
import Paper from "@mui/material/Paper";
import Case from "./Case";
import { Briefcase } from "../../../recoil/deal-or-no-deal-state";

interface BoardProps {
  board: Briefcase[];
  isOver: boolean;
  onClick: (x: number) => void;
  playerChoice?: Briefcase;
}

const style: React.CSSProperties = {
  maxWidth: 796,
  padding: 9,
  textAlign: "center",
  display: "block",
  margin: "auto",
  marginTop: 20,
};

const Board = ({ board, isOver, onClick, playerChoice: pc }: BoardProps) => (
  <Paper elevation={2} style={style}>
    {board.map((bc, i) => (
      <Case
        key={i}
        briefcase={bc}
        isOver={isOver}
        onClick={(): void => onClick(i)}
        secondary={pc && pc.loc === bc.loc}
      />
    ))}
  </Paper>
);

export default Board;
