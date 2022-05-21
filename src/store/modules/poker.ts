import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DBPlayer } from "./types";

export enum PokerGameFunctions {
  DISCARD_CARDS = "Discard Cards",
  END_TURN = "End Turn",
  NEW_GAME = "New Game",
  START_GAME = "Start Game",
}
export interface PokerState {
  gameFunctions: PokerGameFunctions[];
  cardsToDiscard: number[];
  hideHands: boolean;
  gameOver: boolean;
}

/** function to generate the state of a new game */
export const newPokerGameState = (): PokerState => ({
  gameFunctions: [PokerGameFunctions.START_GAME],
  cardsToDiscard: [],
  hideHands: true,
  gameOver: false,
});

const initialState = newPokerGameState();

export const pokerSlice = createSlice({
  name: "poker",
  initialState,
  reducers: {
    /** start a new game in Poker DB */
    newPokerGame: (state, action: PayloadAction<DBPlayer[]>) =>
      newPokerGameState(),

    /** deal cards and begin play (after betting) in Poker DB */
    startPokerGame: (state) => {
      state.gameFunctions = [PokerGameFunctions.DISCARD_CARDS];
      state.hideHands = false;
    },
    /** move to the next player in Poker DB */
    endPokerTurn: (state) => {
      state.gameFunctions = [PokerGameFunctions.DISCARD_CARDS];
      state.cardsToDiscard = [];
    },
    /** end the game by updating a flag in Poker DB */
    endPokerGame: (state) => {
      state.gameFunctions = [PokerGameFunctions.NEW_GAME];
      state.gameOver = true;
    },
    /** reset cards to discard back to empty in Poker DB */
    discardCards: (state) => {
      state.gameFunctions = [PokerGameFunctions.END_TURN];
      state.cardsToDiscard = [];
    },
    /** mark a card for discard in Poker DB */
    updateCardsToDiscard: (state, action: PayloadAction<number[]>) => {
      state.cardsToDiscard = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  startPokerGame,
  endPokerTurn,
  endPokerGame,
  discardCards,
  updateCardsToDiscard,
  newPokerGame,
} = pokerSlice.actions;

export default pokerSlice.reducer;
