import { CSSProperties } from "react";
import Case from "./Case";
import { Briefcase } from "../../../jotai/deal-or-no-deal-state";
import { Paper } from "@mui/material";

interface BoardProps {
  board: Briefcase[];
  isOver: boolean;
  onClick: (x: number) => void;
  playerChoice?: Briefcase;
}

const style: CSSProperties = {
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
