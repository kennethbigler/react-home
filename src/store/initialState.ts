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

import {
  DBBlackjack,
  GameFunctions,
  DBRootState,
  DBSlotDisplay,
  DBDND,
  briefcasesToOpen,
  Briefcase,
} from "./types";
import { TurnState } from "./modules/turn";

// --------------------     helpers     -------------------- //
// blackjack
export const newBlackjackGame = (): DBBlackjack => ({
  gameFunctions: [GameFunctions.FINISH_BETTING],
  hasFunctions: false,
  hideHands: true,
});

// dnd
const getNewState = (): DBDND => ({
  board: [
    { val: 1, loc: 1, on: true },
    { val: 2, loc: 2, on: true },
    { val: 5, loc: 3, on: true },
    { val: 10, loc: 4, on: true },
    { val: 25, loc: 5, on: true },
    { val: 50, loc: 6, on: true },
    { val: 75, loc: 7, on: true },
    { val: 100, loc: 8, on: true },
    { val: 200, loc: 9, on: true },
    { val: 300, loc: 10, on: true },
    { val: 400, loc: 11, on: true },
    { val: 500, loc: 12, on: true },
    { val: 750, loc: 13, on: true },
    { val: 1000, loc: 14, on: true },
    { val: 5000, loc: 15, on: true },
    { val: 10000, loc: 16, on: true },
    { val: 25000, loc: 17, on: true },
    { val: 50000, loc: 18, on: true },
    { val: 75000, loc: 19, on: true },
    { val: 100000, loc: 20, on: true },
    { val: 200000, loc: 21, on: true },
    { val: 300000, loc: 22, on: true },
    { val: 400000, loc: 23, on: true },
    { val: 500000, loc: 24, on: true },
    { val: 750000, loc: 25, on: true },
    { val: 1000000, loc: 26, on: true },
  ],
  turn: 1,
  playerChoice: undefined,
  casesToOpen: briefcasesToOpen,
  sum: 0,
  numCases: 0,
  offer: 0,
  dndOpen: false,
  isOver: false,
});
/** function that takes an array and shuffles it's elements */
const shuffle = (arr: Briefcase[]): void => {
  // shuffle values of briefcases
  for (let i = 0; i < 100; i += 1) {
    // get to random briefcases
    const j = Math.floor(Math.random() * arr.length);
    const k = Math.floor(Math.random() * arr.length);
    // swap the briefcases
    const temp = arr[j].loc;
    arr[j].loc = arr[k].loc;
    arr[k].loc = temp;
  }
};
/** function to get a new game state */
export const newDNDGame = (): DBDND => {
  const state = getNewState();
  // mix up board
  shuffle(state.board);
  // set all flags to un-touched
  state.board.forEach((bc) => {
    // get sum and count of cases remaining
    state.sum += bc.val;
    state.numCases += 1;
    // reset opened flag
    bc.on = true;
  });
  // sort function for the briefcases
  state.board.sort((a, b) => a.loc - b.loc);
  return state;
};

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
