import React from "react";
import Button from "@mui/material/Button";
import { getTurn } from "./helpers";
import { HistoryEntry } from "../../../recoil/tic-tac-toe-atom";

interface HistoryProps {
  history: HistoryEntry[];
  jumpToStep: (move: number) => void;
  step: number;
}

const History: React.FC<HistoryProps> = (props: HistoryProps) => {
  const [ascend, setAscend] = React.useState(true);
  const { history, step, jumpToStep } = props;

  /** function that generates text for the history tracker */
  const getHistoryText = React.useCallback(
    (round: HistoryEntry, move: number): React.ReactNode => {
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
          role="button"
          style={{ display: "block" }}
        >
          {description}
        </Button>
      );
    },
    [jumpToStep, step]
  );

  // move history
  const moves = history.map(getHistoryText);
  // asc vs. desc
  !ascend && moves.reverse();

  return (
    <>
      <Button
        onClick={(): void => {
          setAscend(!ascend);
        }}
        style={{ marginTop: 20, marginBottom: 20 }}
        variant="contained"
        role="button"
      >
        {ascend ? "Asc" : "Desc"}
      </Button>
      {moves}
    </>
  );
};

export default History;
