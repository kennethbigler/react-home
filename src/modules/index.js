import { combineReducers } from 'redux';
import turn from './turn';
import players from './players';

const rootReducer = combineReducers({
  // ES6 shorthand property name: "x," === "x: x,"
  turn: turn,
  players: players
});

export default rootReducer;
