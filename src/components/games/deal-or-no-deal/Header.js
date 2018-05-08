import React from 'react';
import types from 'prop-types';
import {getMoneyText} from './common';
import RaisedButton from 'material-ui/RaisedButton';
// Parents: DealOrNoDeal


export const Header = (props) => {
  // prop vars
  const {
    playerChoice: pc,
    casesToOpen,
    isOver,
    offer,
    newGame,
    player,
  } = props;
  // rendered component
  return (
    <div className="row">
      <div className="col-sm-6">
        <h1>
          Your Case: {pc ? pc.loc : '?'}
          {isOver && ` - ${getMoneyText(pc.val)}`}
        </h1>
        <h2>
          {isOver
            ? `You Won ${getMoneyText(offer)}`
            : `Number of Cases to Open: ${casesToOpen}`}
        </h2>
        {isOver && <RaisedButton label="New Game" onClick={newGame} primary />}
      </div>
      <div className="col-sm-6">
        <h1 style={{textAlign: 'right'}}>
          {player.name}: {getMoneyText(player.money)}
        </h1>
      </div>
    </div>
  );
};

Header.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  casesToOpen: types.number.isRequired,
  isOver: types.bool.isRequired,
  newGame: types.func.isRequired,
  offer: types.number,
  player: types.shape({
    name: types.string.isRequired,
    money: types.number.isRequired,
  }).isRequired,
  playerChoice: types.shape({
    loc: types.number.isRequired,
    val: types.number.isRequired,
  }),
};
