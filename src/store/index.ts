import themeReducer from "./modules/theme";
import aytoReducer from "./modules/ayto";
import pokerReducer from "./modules/poker";
import playersReducer from "./modules/players";
import turnReducer from "./modules/turn";
import dndReducer from "./modules/dnd";
import blackjackReducer from "./modules/blackjack";

const rootReducer = {
  ayto: aytoReducer,
  blackjack: blackjackReducer,
  dnd: dndReducer,
  players: playersReducer,
  poker: pokerReducer,
  theme: themeReducer,
  turn: turnReducer,
};

export default rootReducer;
