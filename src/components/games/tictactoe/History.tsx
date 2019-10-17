import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import map from 'lodash/map';
import get from 'lodash/get';
import { getTurn } from './constants';

export interface HistoryEntry {
  board: string[] | undefined[];
  location?: number;
}
interface HistoryProps {
  history: HistoryEntry[];
  jumpToStep: Function;
  step: number;
}

const History: React.FC<HistoryProps> = (props: HistoryProps) => {
  const [ascend, setAscend] = useState(true);
  const { history, step, jumpToStep } = props;

  /** function that generates text for the history tracker */
  const getHistoryText = (round: HistoryEntry, move: number): React.ReactNode => {
    const location = get(round, 'location', 0);
    // generate description text
    const description = !move
      ? 'Game Start (Turn, Col, Row)'
      : `Move #${move} (${getTurn(move - 1)}, `
      + `${Math.floor(location / 3)}, ${location % 3})`;
    // highlight current turn displayed on board
    const color = step === move ? 'secondary' : 'default';

    return (
      <Button
        key={move}
        color={color}
        onClick={(): void => jumpToStep(move)}
        style={{ display: 'block' }}
      >
        {description}
      </Button>
    );
  };

  // move history
  const moves = map(history, getHistoryText);
  // asc vs. desc
  !ascend && moves.reverse();

  return (
    <>
      <Button
        onClick={(): void => { setAscend(!ascend); }}
        style={{ marginTop: 20, marginBottom: 20 }}
        variant="contained"
      >
        {ascend ? 'Asc' : 'Desc'}
      </Button>
      {moves}
    </>
  );
};

export default History;
