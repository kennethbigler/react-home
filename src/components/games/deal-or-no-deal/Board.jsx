import React from 'react';
import types from 'prop-types';
import Paper from '@material-ui/core/Paper';
import map from 'lodash/map';
import Case from './Case';
// Parents: Degree

const Board = (props) => {
  // prop vars
  const { board, onClick, playerChoice: pc } = props;
  // local styles
  const style = {
    maxWidth: 796,
    padding: 9,
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
    marginTop: 20,
  };
  // rendered component
  return (
    <Paper elevation={2} style={style}>
      {map(board, (bc, i) => (
        <Case
          key={i}
          briefcase={bc}
          onClick={() => onClick(i)}
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
      loc: types.number.isRequired,
    }),
  ).isRequired,
  onClick: types.func.isRequired,
  playerChoice: types.shape({ loc: types.number.isRequired }),
};

export default Board;
