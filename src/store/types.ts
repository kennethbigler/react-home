import { Connect4State } from "./modules/connect4";
import { GitState } from "./modules/git";
import { ThemeState } from "./modules/theme";
import { TicTacToeState } from "./modules/ticTacToe";
import { YahtzeeState } from "./modules/yahtzee";
import { AYTOState } from "./modules/ayto";
import { PokerState } from "./modules/poker";
import { DBPlayer, DBSlotDisplay, TurnState } from "./modules/types";
import { DNDState } from "./modules/dnd";
import { BlackjackState } from "./modules/blackjack";

// --------------------     root     -------------------- //
export interface DBRootState {
  ayto: AYTOState;
  blackjack: BlackjackState;
  connect4: Connect4State;
  dnd: DNDState;
  git: GitState;
  gqlToken: string;
  players: DBPlayer[];
  poker: PokerState;
  theme: ThemeState;
  ticTacToe: TicTacToeState;
  turn: TurnState;
  yahtzee: YahtzeeState;
  slots: DBSlotDisplay[];
}
