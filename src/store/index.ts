import { combineReducers } from 'redux';
import connect4 from './modules/connect4';
import dnd from './modules/dnd';
import dota2 from './modules/dota2';
import git from './modules/git';
import gqlToken from './modules/gqlToken';
import players from './modules/players';
import slots from './modules/slots';
import theme from './modules/theme';
import ticTacToe from './modules/ticTacToe';
import turn from './modules/turn';
import yahtzee from './modules/yahtzee';

const rootReducer = combineReducers({
  connect4,
  dnd,
  dota2,
  git,
  gqlToken,
  players,
  slots,
  theme,
  ticTacToe,
  turn,
  yahtzee,
});

export default rootReducer;
