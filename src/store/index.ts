import connect4Reducer from "./modules/connect4";
import gitReducer from "./modules/git";
import themeReducer from "./modules/theme";
import ticTacToeReducer from "./modules/ticTacToe";
import aytoReducer from "./modules/ayto";
import pokerReducer from "./modules/poker";
import playersReducer from "./modules/players";
import turnReducer from "./modules/turn";
import dndReducer from "./modules/dnd";
import blackjackReducer from "./modules/blackjack";
import gqlTokenReducer from "./modules/gqlToken";

const rootReducer = {
  ayto: aytoReducer,
  blackjack: blackjackReducer,
  connect4: connect4Reducer,
  dnd: dndReducer,
  git: gitReducer,
  gqlToken: gqlTokenReducer,
  players: playersReducer,
  poker: pokerReducer,
  theme: themeReducer,
  ticTacToe: ticTacToeReducer,
  turn: turnReducer,
};

export default rootReducer;
