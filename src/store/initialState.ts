import indigo from '@material-ui/core/colors/indigo';
import deepOrange from '@material-ui/core/colors/deepOrange';
import { pullHandle } from '../apis/SlotMachine';

import {
  DBGit, DBPlayer, DBBlackjack, GameFunctions,
  DBUITheme, DBTurn, DBRootState, DBSlotDisplay,
  DBTicTacToe, DBConnect4, C4Turn, DBYahtzee, DBDND,
  briefcasesToOpen, Briefcase, PokerGameFunctions, DBPoker,
} from './types';

// --------------------     helpers     -------------------- //
// blackjack
export const newBlackjackGame = (): DBBlackjack => ({
  gameFunctions: [GameFunctions.FINISH_BETTING],
  hasFunctions: false,
  hideHands: true,
});
// connect4
const NEW_BOARD = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];
export const newConnect4Game = (): DBConnect4 => ({
  board: NEW_BOARD.reduce(
    (acc: number[][], row) => {
      acc.push([...row]);
      return acc;
    },
    [],
  ),
  winner: undefined,
  line: [undefined, undefined, undefined],
  turn: C4Turn.RED,
});

// dnd
const getNewState = (): DBDND => ({
  board: [
    { val: 1, loc: 1, on: true }, { val: 2, loc: 2, on: true }, { val: 5, loc: 3, on: true },
    { val: 10, loc: 4, on: true }, { val: 25, loc: 5, on: true }, { val: 50, loc: 6, on: true },
    { val: 75, loc: 7, on: true }, { val: 100, loc: 8, on: true }, { val: 200, loc: 9, on: true },
    { val: 300, loc: 10, on: true }, { val: 400, loc: 11, on: true }, { val: 500, loc: 12, on: true },
    { val: 750, loc: 13, on: true }, { val: 1000, loc: 14, on: true }, { val: 5000, loc: 15, on: true },
    { val: 10000, loc: 16, on: true }, { val: 25000, loc: 17, on: true }, { val: 50000, loc: 18, on: true },
    { val: 75000, loc: 19, on: true }, { val: 100000, loc: 20, on: true }, { val: 200000, loc: 21, on: true },
    { val: 300000, loc: 22, on: true }, { val: 400000, loc: 23, on: true }, { val: 500000, loc: 24, on: true },
    { val: 750000, loc: 25, on: true }, { val: 1000000, loc: 26, on: true },
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

// player
export const newPlayer = (id: number, name = 'Bot', isBot = true): DBPlayer => ({
  id,
  name,
  isBot,
  status: '',
  money: 100,
  bet: 5,
  hands: [],
});

// poker
/** function to generate the state of a new game */
export const newPokerGameState = (): DBPoker => ({
  gameFunctions: [PokerGameFunctions.START_GAME],
  cardsToDiscard: [],
  hideHands: true,
  previousPlayer: -1,
});

// tic-tac-toe
export const X = 'X';
export const O = 'O';
export const EMPTY = undefined;
export const newTicTacToe = (): DBTicTacToe => ({
  history: [{ board: Array(9).fill(EMPTY) }],
  turn: X,
  step: 0,
});

// yahtzee
export const newYahtzee = (): Omit<DBYahtzee, 'scores'> => ({
  roll: 0,
  values: [0, 0, 0, 0, 0],
  saved: [],
  turn: 0,
  showScoreButtons: false,
  hasScored: false,
  topScores: [-1, -1, -1, -1, -1, -1],
  bottomScores: [-1, -1, -1, -1, -1, -1, -1],
});

// --------------------     initial states     -------------------- //
const blackjack = newBlackjackGame();
const connect4 = newConnect4Game();
const dnd = newDNDGame();
const git: DBGit = {
  storyID: '',
  branchMessage: '',
  branchPrefix: 'features',
  casePreference: 'snake_case',
  commitPrefix: true,
};
const gqlToken = '';
const players: DBPlayer[] = [
  newPlayer(1, 'Ken', false),
  newPlayer(2),
  newPlayer(3),
  newPlayer(4),
  newPlayer(5),
  newPlayer(6),
  newPlayer(0, 'Dealer', true),
];
const poker = newPokerGameState();
const slots: DBSlotDisplay[] = pullHandle();
const theme: DBUITheme = {
  primary: indigo,
  secondary: deepOrange,
  type: 'dark',
};
const ticTacToe: DBTicTacToe = newTicTacToe();
const turn: DBTurn = { player: 0, hand: 0 };
const yahtzee: DBYahtzee = { ...newYahtzee(), scores: []};

// --------------------     export     -------------------- //
export default {
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
