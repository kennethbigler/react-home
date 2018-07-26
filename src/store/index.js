import combineReducers from 'redux';
import turn from './modules/turn';
import players from './modules/players';
import git from './modules/git';

const rootReducer = combineReducers({ turn, players, git });

export default rootReducer;
