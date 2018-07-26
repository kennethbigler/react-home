import React from 'react';
import types from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import getMoneyText from './common';
// Parents: DealOrNoDeal

const Header = (props) => {
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
    <Grid container spacing={16}>
      <Grid item sm={6} xs={12}>
        <h1>
          Your Case:
          {' '}
          {pc ? pc.loc : '?'}
          {isOver && ` - ${getMoneyText(pc.val)}`}
        </h1>
        <h2>
          {isOver
            ? `You Won ${getMoneyText(offer)}`
            : `Number of Cases to Open: ${casesToOpen}`}
        </h2>
        {isOver && (
          <Button color="primary" onClick={newGame} variant="raised">
            New Game
          </Button>
        )}
      </Grid>
      <Grid item sm={6} xs={12}>
        <h1 style={{ textAlign: 'right' }}>
          {player.name}
          :
          {getMoneyText(player.money)}
        </h1>
      </Grid>
    </Grid>
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

export default Header;
