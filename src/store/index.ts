import { combineReducers } from "redux";
import blackjack from "./modules/blackjack";
import connect4 from "./modules/connect4";
import dnd from "./modules/dnd";
import git from "./modules/git";
import gqlToken from "./modules/gqlToken";
import players from "./modules/players";
import poker from "./modules/poker";
import slots from "./modules/slots";
import theme from "./modules/theme";
import ticTacToe from "./modules/ticTacToe";
import turn from "./modules/turn";
import yahtzee from "./modules/yahtzee";

const rootReducer = combineReducers({
  blackjack,
  connect4,
  dnd,
  git,
  gqlToken,
  players,
  poker,
  slots,
  theme,
  ticTacToe,
  turn,
  yahtzee,
});

export default rootReducer;
