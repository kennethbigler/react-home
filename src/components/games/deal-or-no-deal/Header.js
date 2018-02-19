import React from 'react';
import PropTypes from 'prop-types';
import { getMoneyText } from './common';
import RaisedButton from 'material-ui/RaisedButton';
// Parents: Degree

/** render code for each class */
export const Header = props => {
  // prop vars
  const { playerChoice: pc, casesToOpen, isOver, offer, newGame } = props;
  return (
    <div>
      <h2>
        Your Case: {pc ? pc.loc : '?'}
        {isOver && ` - ${getMoneyText(pc.val)}`}
      </h2>
      <h2>
        {isOver
          ? `You Won ${getMoneyText(offer)}`
          : `Number of Cases to Open: ${casesToOpen}`}
      </h2>
      {isOver && <RaisedButton onTouchTap={newGame} primary label="New Game" />}
    </div>
  );
};

Header.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  offer: PropTypes.number,
  playerChoice: PropTypes.object,
  newGame: PropTypes.func.isRequired,
  casesToOpen: PropTypes.number.isRequired,
  isOver: PropTypes.bool.isRequired
};
