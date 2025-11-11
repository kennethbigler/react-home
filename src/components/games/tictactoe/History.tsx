import { useState, ReactElement } from "react";
import { getTurn } from "./helpers";
import { HistoryEntry } from "../../../jotai/tic-tac-toe-atom";
import { Button } from "@mui/material";

interface HistoryProps {
  history: HistoryEntry[];
  jumpToStep: (move: number) => void;
  step: number;
}

const History = ({ history, step, jumpToStep }: HistoryProps) => {
  const [ascend, setAscend] = useState(true);

  /** function that generates text for the history tracker */
  const getHistoryText = (round: HistoryEntry, move: number): ReactElement => {
    const location = round.location || 0;
    // generate description text
    const description = !move
      ? "Game Start (Turn, Col, Row)"
      : `Move #${move} (${getTurn(move - 1)}, ` +
        `${Math.floor(location / 3)}, ${location % 3})`;
    // highlight current turn displayed on board
    const color = step === move ? "secondary" : "primary";

    return (
      <Button
        key={move}
        color={color}
        onClick={(): void => jumpToStep(move)}
        style={{ display: "block" }}
      >
        {description}
      </Button>
    );
  };

  // move history
  const moves = history.map(getHistoryText);
  // asc vs. desc
  if (!ascend) {
    moves.reverse();
  }

  return (
    <>
      <Button
        onClick={(): void => {
          setAscend(!ascend);
        }}
        style={{ marginTop: 20, marginBottom: 20 }}
        variant="contained"
      >
        {ascend ? "Asc" : "Desc"}
      </Button>
      {moves}
    </>
  );
};

export default History;
