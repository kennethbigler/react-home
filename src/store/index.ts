import playersReducer from "./modules/players";
import turnReducer from "./modules/turn";
import blackjackReducer from "./modules/blackjack";

const rootReducer = {
  blackjack: blackjackReducer,
  players: playersReducer,
  turn: turnReducer,
};

export default rootReducer;
