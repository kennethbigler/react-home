import pokerReducer from "./modules/poker";
import playersReducer from "./modules/players";
import turnReducer from "./modules/turn";
import blackjackReducer from "./modules/blackjack";

const rootReducer = {
  blackjack: blackjackReducer,
  players: playersReducer,
  poker: pokerReducer,
  turn: turnReducer,
};

export default rootReducer;
