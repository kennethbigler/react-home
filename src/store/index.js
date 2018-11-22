import { combineReducers } from 'redux';
import turn from './modules/turn';
import players from './modules/players';
import git from './modules/git';
import theme from './modules/theme';
import yahtzee from './modules/yahtzee';

const rootReducer = combineReducers({
  turn, players, git, theme, yahtzee,
});

export default rootReducer;
