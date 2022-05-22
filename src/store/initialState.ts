import { teal, deepOrange } from "@mui/material/colors";
import SlotMachine from "../apis/SlotMachine";
import { newConnect4Game } from "./modules/connect4";
import { GitState } from "./modules/git";
import { ThemeState } from "./modules/theme";
import { newTicTacToe } from "./modules/ticTacToe";
import { YahtzeeState, newYahtzee } from "./modules/yahtzee";
import { newAreYouTheOne } from "./modules/ayto";
import { newPokerGameState } from "./modules/poker";
import { newPlayer } from "./modules/players";
import { DBSlotDisplay, TurnState } from "./modules/types";
import { newDNDGame } from "./modules/dnd";
import { DBRootState } from "./types";
import { newBlackjackGame } from "./modules/blackjack";

// --------------------     initial states     -------------------- //
const ayto = newAreYouTheOne();
const blackjack = newBlackjackGame();
const connect4 = newConnect4Game();
const dnd = newDNDGame();
const git: GitState = {
  storyID: "",
  branchMessage: "",
  branchPrefix: "features",
  casePreference: "snake_case",
  commitPrefix: true,
};
const gqlToken = "";
const players = [
  newPlayer(1, "Ken", false),
  newPlayer(2),
  newPlayer(3),
  newPlayer(4),
  newPlayer(5),
  newPlayer(6),
  newPlayer(0, "Dealer", true),
];
const poker = newPokerGameState();
const slots: DBSlotDisplay[] = SlotMachine.pullHandle();
const theme: ThemeState = {
  primary: teal,
  secondary: deepOrange,
  mode: "dark",
};
const ticTacToe = newTicTacToe();
const turn: TurnState = { player: 0, hand: 0 };
const yahtzee: YahtzeeState = { ...newYahtzee(), scores: [] };

// --------------------     export     -------------------- //
export default {
  ayto,
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
} as DBRootState;
