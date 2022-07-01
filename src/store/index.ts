import pokerReducer from "./modules/poker";
import playersReducer from "./modules/players";
import turnReducer from "./modules/turn";
import dndReducer from "./modules/dnd";
import blackjackReducer from "./modules/blackjack";

const rootReducer = {
  blackjack: blackjackReducer,
  dnd: dndReducer,
  players: playersReducer,
  poker: pokerReducer,
  turn: turnReducer,
};

export default rootReducer;
