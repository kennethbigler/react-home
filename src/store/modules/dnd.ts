import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// --------------------     Slice     -------------------- //
export interface Briefcase {
  on: boolean;
  loc: number;
  val: number;
}
export interface DNDState {
  board: Briefcase[];
  turn: number;
  playerChoice?: Briefcase;
  casesToOpen: number;
  sum: number;
  numCases: number;
  offer: number;
  dndOpen: boolean;
  isOver: boolean;
}
export const briefcasesToOpen = 6;

const getNewState = (): DNDState => ({
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
export const newDNDGame = (): DNDState => {
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

const initialState = newDNDGame();

export const dndSlice = createSlice({
  name: "dnd",
  initialState,
  reducers: {
    /** set to a new game in Deal or No Deal DB */
    newGame: () => newDNDGame(),
    /** charge user to play and set player choice
     * NOTE: avg (Expected win value) is 131477.62 / 1k = $132 */
    setPlayerChoice: (
      state,
      action: PayloadAction<{ id: number; playerChoice: Briefcase }>
    ) => {
      state.playerChoice = action.payload.playerChoice;
    },
    /** open a case and update game variables in Deal or No Deal DB */
    setOpenCase: (
      state,
      action: PayloadAction<{
        board: Briefcase[];
        caseNum: number;
        sum: number;
        numCases: number;
        casesToOpen: number;
      }>
    ) => {
      state.board = action.payload.board;
      // flag the value and update global trackers
      state.board[action.payload.caseNum].on = false;
      state.sum = action.payload.sum;
      state.numCases = action.payload.numCases;
      state.casesToOpen = action.payload.casesToOpen;
    },
    /** display the offer from the banker and open modal in Deal or No Deal DB */
    setOpenOffer: (
      state,
      action: PayloadAction<{
        offer: number;
        casesToOpen: number;
      }>
    ) => {
      state.offer = action.payload.offer;
      state.casesToOpen = action.payload.casesToOpen;
      state.dndOpen = true;
    },
    /** reject the offer and continue playing in Deal or No Deal DB */
    setNoDeal: (state, action: PayloadAction<number>) => {
      state.dndOpen = false;
      state.turn = action.payload + 1;
    },
    /** function to finish the game
     * NOTE: payout to user offer / 1k */
    setFinishGame: (
      state,
      action: PayloadAction<{ id: number; offer: number }>
    ) => {
      state.dndOpen = false;
      state.isOver = true;
      state.offer = action.payload.offer;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  newGame,
  setPlayerChoice,
  setOpenCase,
  setOpenOffer,
  setNoDeal,
  setFinishGame,
} = dndSlice.actions;

export default dndSlice.reducer;
