import { combineReducers } from 'redux';
import turn from './modules/turn';
import players from './modules/players';
import git from './modules/git';
import theme from './modules/theme';

const rootReducer = combineReducers({
  turn, players, git, theme,
});

export default rootReducer;
