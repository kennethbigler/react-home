import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { drawCard, splitHand as pSplitHand } from "./players-thunks";
import { TurnState, DBHand, DBPlayer, WeighFunc } from "./types";

// --------------------     Thunks     -------------------- //
/** split hands of provided player/hand in Blackjack DB */
export const splitHand = createAsyncThunk<
  void,
  {
    hands: DBHand[];
    id: number;
    hNum: number;
    weigh: WeighFunc;
  }
>("blackjack/splitHand", async ({ hands, id, hNum, weigh }, thunkAPI) => {
  await thunkAPI.dispatch(pSplitHand({ hands, id, hNum, weigh }));
});
/** get a new card for turn hand in Blackjack DB */
export const hitHand = createAsyncThunk<
  void,
  {
    hands: DBHand[];
    id: number;
    hNum: number;
    weigh: WeighFunc;
  }
>("blackjack/hitHand", async ({ hands, id, hNum, weigh }, thunkAPI) => {
  await thunkAPI.dispatch(drawCard({ hands, id, hNum, num: 1, weigh }));
});
/** double your bet and get 1 card in Blackjack DB */
export const doubleHand = createAsyncThunk<
  void,
  {
    player: DBPlayer;
    turn: TurnState;
    weigh: WeighFunc;
  }
>("blackjack/doubleHand", async ({ player, turn, weigh }, thunkAPI) => {
  const { id, hands } = player;
  await thunkAPI.dispatch(
    drawCard({ hands, id, hNum: turn.hand, num: 1, weigh })
  );
});

// --------------------     Slice     -------------------- //
export enum GameFunctions {
  NEW_GAME = "New Game",
  FINISH_BETTING = "Finish Betting",
  STAY = "Stay",
  HIT = "Hit",
  DOUBLE = "Double",
  SPLIT = "Split",
}

export interface BlackjackState {
  gameFunctions: string[];
  hasFunctions: boolean;
  hideHands: boolean;
}

export const newBlackjackGame = (): BlackjackState => ({
  gameFunctions: [GameFunctions.FINISH_BETTING],
  hasFunctions: false,
  hideHands: true,
});

const initialState = newBlackjackGame();

export const blackjackSlice = createSlice({
  name: "blackjack",
  initialState,
  reducers: {
    updateGameFunctions: (state, action: PayloadAction<string[]>) => {
      state.gameFunctions = action.payload;
    },
    updateHideHands: (state, action: PayloadAction<boolean>) => {
      state.hideHands = action.payload;
    },
    updateHasFunctions: (state, action: PayloadAction<boolean>) => {
      state.hasFunctions = action.payload;
    },
    /** start a new game in Blackjack DB */
    setNewGame: (state, action: PayloadAction<DBPlayer[]>) => {
      const { gameFunctions, hasFunctions, hideHands } = newBlackjackGame();
      state.gameFunctions = gameFunctions;
      state.hasFunctions = hasFunctions;
      state.hideHands = hideHands;
    },
    /** go to the next turn in Blackjack DB */
    stayHand: (state, action: PayloadAction<boolean>) => {
      state.hasFunctions = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(splitHand.fulfilled, (state) => {
        state.hasFunctions = false;
      })
      .addCase(hitHand.fulfilled, (state) => {
        state.hasFunctions = false;
      })
      .addCase(doubleHand.fulfilled, (state, action) => {
        const lastHand = action.meta.arg.player.hands.length - 1;

        state.hasFunctions = true;
        blackjackSlice.caseReducers.stayHand(state, {
          ...action,
          payload: action.meta.arg.turn.hand < lastHand,
        });
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  updateGameFunctions,
  updateHideHands,
  updateHasFunctions,
  setNewGame,
  stayHand,
} = blackjackSlice.actions;

export default blackjackSlice.reducer;
