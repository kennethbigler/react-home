import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Deck, { DBCard } from "../../apis/Deck";
import { doubleHand, setNewGame } from "./blackjack";
import { DBHand, DBPlayer, WeighFunc } from "./types";
import { newHand, drawCard, splitHand, swapCards } from "./players-thunks";

/** card helper */
export const defaultWeigh: WeighFunc = () => ({ weight: 0, soft: false });

export const newPlayer = (
  id: number,
  name = "Bot",
  isBot = true
): DBPlayer => ({
  id,
  name,
  isBot,
  status: "",
  money: 100,
  bet: 5,
  hands: [],
});

const initialState: DBPlayer[] = [
  newPlayer(1, "Ken", false),
  newPlayer(2),
  newPlayer(3),
  newPlayer(4),
  newPlayer(5),
  newPlayer(6),
  newPlayer(0, "Dealer", true),
];

export const playersSlice = createSlice({
  name: "players",
  initialState,
  reducers: {
    /** function to add a player to the state */
    addPlayer: (state, action: PayloadAction<string>) => {
      const player = newPlayer(state.length, action.payload);
      state.push(player);
    },
    /** function to remove player from player array */
    removePlayer: (state, action: PayloadAction<number>) =>
      state.filter((player) => player.id !== action.payload),
    /** function to update a player's name */
    updateName: (
      state,
      action: PayloadAction<{ id: number; name: string }>
    ) => {
      const pi = state.findIndex((p) => p.id === action.payload.id);
      if (pi !== -1) {
        state[pi].name = action.payload.name;
      }
    },
    /** function to update a player's bot status */
    updateBot: (
      state,
      action: PayloadAction<{ id: number; isBot: boolean }>
    ) => {
      const pi = state.findIndex((p) => p.id === action.payload.id);
      if (pi !== -1) {
        state[pi].isBot = action.payload.isBot;
      }
    },
    /** function to update a player's bet */
    updateBet: (state, action: PayloadAction<{ id: number; bet?: number }>) => {
      const pi = state.findIndex((p) => p.id === action.payload.id);
      if (pi !== -1) {
        state[pi].bet = action.payload.bet || 5;
      }
    },
    /** function to pay the winners and take money from the losers */
    payout: (
      state,
      action: PayloadAction<{ id: number; status: string; money: number }>
    ) => {
      const pi = state.findIndex((p) => p.id === action.payload.id);
      if (pi !== -1) {
        state[pi].status = action.payload.status;
        state[pi].money += action.payload.money;
      }
    },
    updateHands: (
      state,
      action: PayloadAction<{ id: number; hands: DBHand[] }>
    ) => {
      const pi = state.findIndex((p) => p.id === action.payload.id);
      if (pi !== -1) {
        state[pi].hands = action.payload.hands;
      }
    },
    createNewHandAction: (
      state,
      action: PayloadAction<{
        id: number;
        cards: DBCard[];
        soft: boolean;
        weight: number;
      }>
    ) => {
      const pi = state.findIndex((p) => p.id === action.payload.id);
      if (pi !== -1) {
        const { cards, weight, soft } = action.payload;
        state[pi].hands = [{ cards, weight, soft }];
      }
    },
    /** function to reset player status
     * @param {number} id - optional, what player should get a new hand, default 0
     * @return {Object}
     */
    resetStatus: (state, action: PayloadAction<number>) => {
      const pi = state.findIndex((p) => p.id === action.payload);
      if (pi !== -1) {
        state[pi].status = "";
        state[pi].hands = [];
        state[pi].bet = 5;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(newHand.fulfilled, (state, action) => {
        const cards = [...action.payload];
        cards.sort(Deck.rankSort);
        const { weight, soft } = action.meta.arg.weigh
          ? action.meta.arg.weigh(cards)
          : defaultWeigh(cards);
        playersSlice.caseReducers.createNewHandAction(state, {
          ...action,
          payload: {
            id: action.meta.arg.id,
            cards,
            soft,
            weight,
          },
        });
      })
      .addCase(drawCard.fulfilled, (state, action) => {
        const drawnCards = [...action.payload];
        const hNum: number = action.meta.arg.hNum || 0;
        const cards = [...action.meta.arg.hands[hNum].cards, ...drawnCards];
        const { weight, soft } = action.meta.arg.weigh
          ? action.meta.arg.weigh(cards)
          : defaultWeigh(cards);
        const hands = action.meta.arg.hands.map((item, i) =>
          i !== hNum ? item : { cards, weight, soft }
        );
        playersSlice.caseReducers.updateHands(state, {
          ...action,
          payload: { id: action.meta.arg.id, hands },
        });
      })
      .addCase(splitHand.fulfilled, (state, action) => {
        const hNum: number = action.meta.arg.hNum || 0;
        const weigh = action.meta.arg.weigh || defaultWeigh;
        const hand = action.meta.arg.hands[hNum];
        // split the hands into 2
        const hand1: DBHand = { cards: [hand.cards[0]] };
        const hand2: DBHand = { cards: [hand.cards[1]] };

        hand1.cards.push(action.payload[0]);
        hand2.cards.push(action.payload[1]);

        // update the weights
        Object.assign(hand1, weigh(hand1.cards));
        Object.assign(hand2, weigh(hand2.cards));
        // update global hands
        const hands = action.meta.arg.hands.map((item, i) =>
          i !== hNum ? item : hand2
        );
        hands.splice(hNum, 0, hand1);

        playersSlice.caseReducers.updateHands(state, {
          ...action,
          payload: { id: action.meta.arg.id, hands },
        });
      })
      .addCase(swapCards.fulfilled, (state, action) => {
        const cards = [...action.meta.arg.hands[0].cards];
        action.meta.arg.cardsToDiscard.forEach((discardi, i) => {
          cards[discardi] = action.payload[i];
        });
        cards.sort(Deck.rankSort);
        const hands = action.meta.arg.hands.map((item, i) =>
          i !== 0 ? item : { cards }
        );
        playersSlice.caseReducers.updateHands(state, {
          ...action,
          payload: { id: action.meta.arg.id, hands },
        });
      })
      .addCase(setNewGame, (state, action) => {
        action.payload.forEach((player) =>
          playersSlice.caseReducers.resetStatus(state, {
            ...action,
            payload: player.id,
          })
        );
      })
      .addCase(doubleHand.fulfilled, (state, action) => {
        const { id, bet } = action.meta.arg.player;

        playersSlice.caseReducers.updateBet(state, {
          ...action,
          payload: { id, bet: bet * 2 },
        });
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  addPlayer,
  removePlayer,
  updateName,
  updateBot,
  updateBet,
  payout,
  updateHands,
  createNewHandAction,
  resetStatus,
} = playersSlice.actions;

export default playersSlice.reducer;
