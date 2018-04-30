import React from 'react';
import types from 'prop-types';
import { Case } from './Case';
import Paper from 'material-ui/Paper';
// Parents: Degree

/** render code for each class */
export const Board = props => {
  // prop vars
  const { board, onClick, playerChoice: pc } = props;
  // local styles
  const style = {
    maxWidth: 796,
    padding: 9,
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
    marginTop: 20
  };
  // rendered component
  return (
    <Paper style={style} zDepth={2}>
      {board.map((bc, i) => (
        <Case
          key={i}
          onClick={() => onClick(i)}
          briefcase={bc}
          secondary={pc && pc.loc === bc.loc}
        />
      ))}
    </Paper>
  );
};

Board.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  board: types.arrayOf(
    types.shape({
      loc: types.number.isRequired
    })
  ).isRequired,
  onClick: types.func.isRequired,
  playerChoice: types.shape({ loc: types.number.isRequired })
};
