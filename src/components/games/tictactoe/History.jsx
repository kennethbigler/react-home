import React, { useState, Fragment } from 'react';
import types from 'prop-types';
import Button from '@material-ui/core/Button';
import map from 'lodash/map';
import { getTurn } from './constants';
// Parents: TicTacToe

/* ========================================
 * History
 * ======================================== */
const History = (props) => {
  const [ascend, setAscend] = useState(true);
  const { history, step, jumpToStep } = props;

  /**
   * function that generates text for the history tracker
   * @param {Object} round - contains board and click location for turn
   * @param {number} move - just index tracking
   * @return {Object}
   */
  const getHistoryText = (round, move) => {
    // generate description text
    const description = !move
      ? 'Game Start (Turn, Col, Row)'
      : `Move #${move} (${getTurn(move - 1)}, `
      + `${Math.floor(round.location / 3)}, ${round.location % 3})`;
    // highlight current turn displayed on board
    const color = step === move ? 'secondary' : 'default';
    return (
      <Button
        key={move}
        color={color}
        onClick={() => jumpToStep(move)}
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
        onClick={() => { setAscend(!ascend); }}
        style={{ marginTop: 20, marginBottom: 20 }}
        variant="contained"
      >
        {ascend ? 'Asc' : 'Desc'}
      </Button>
      {moves}
    </>
  );
};

History.propTypes = {
  history: types.arrayOf(types.shape({ location: types.number })).isRequired,
  jumpToStep: types.func.isRequired,
  step: types.number.isRequired,
};

export default History;
