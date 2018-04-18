import React from 'react';
import PropTypes from 'prop-types';
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
  // PropTypes = [string, object, bool, number, func, array].isRequired
  board: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  playerChoice: PropTypes.object
};
