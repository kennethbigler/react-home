import { combineReducers } from 'redux';
import turn from './modules/turn';
import players from './modules/players';

const rootReducer = combineReducers({
  // ES6 shorthand property name: "x," === "x: x,"
  turn: turn,
  players: players
});

export default rootReducer;
