import React from 'react';
import types from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { getMoneyText } from './common';
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
    <Grid container spacing={1}>
      <Grid item sm={6} xs={12}>
        <Typography variant="h3" gutterBottom>
          Your Case:
          {' '}
          {pc ? pc.loc : '?'}
          {isOver && ` - ${getMoneyText(pc.val)}`}
        </Typography>
        <Typography variant="h4" gutterBottom>
          {isOver
            ? `You Won ${getMoneyText(offer)}`
            : `Number of Cases to Open: ${casesToOpen}`}
        </Typography>
        {isOver && (
          <Button color="primary" onClick={newGame} variant="contained">
            New Game
          </Button>
        )}
      </Grid>
      <Grid item sm={6} xs={12}>
        <Typography variant="h3" align="right" gutterBottom>
          {player.name}
          :
          {getMoneyText(player.money)}
        </Typography>
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
