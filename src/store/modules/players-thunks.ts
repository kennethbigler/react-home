import { createAsyncThunk } from "@reduxjs/toolkit";
import Deck, { DBCard } from "../../apis/Deck";
import { DBHand, WeighFunc } from "./types";

interface ThunkParams {
  hands: DBHand[];
  id: number;
  hNum?: number;
  num?: number;
  weigh?: WeighFunc;
}

// --------------------     Thunks     -------------------- //

type NewHandParams = Omit<ThunkParams, "hands" | "hNum">;
/** function to have a player draw a card
 * @param {number} id - what player should get a new hand, default 0
 * @param {number} num - optional, number of cards, default 1
 * @param {function} weigh - optional, get weight of hand for game
 * @return {Object}
 */
export const newHand = createAsyncThunk<DBCard[], NewHandParams>(
  "players/newHand",
  async ({ num }) => {
    const response = await Deck.deal(num || 1);
    return response;
  }
);

type DrawCardParams = ThunkParams;
/** function to have a player draw a card
 * @param {Object[]} hands - pass in player's hands to be mutated with new card
 * @param {number} id - tells us which player to update
 * @param {number} hNum - optional, if multiple hands
 * @param {number} num - optional, number of cards, default 1
 * @param {function} weigh - optional, get weight of hand for game
 * @return {Object}
 */
export const drawCard = createAsyncThunk<DBCard[], DrawCardParams>(
  "players/drawCard",
  async ({ num }) => {
    const response = await Deck.deal(num || 1);
    return response;
  }
);

type SplitHandParams = Omit<ThunkParams, "num">;
/** function to split players cards into 2 hands
 * @param {Object[]} hands - pass in player's hands to be mutated with new card
 * @param {number} id - tells us which player to update
 * @param {number} hNum - optional, if multiple hands
 * @param {function} weigh - optional, get weight of hand for game
 * @return {Object}
 */
export const splitHand = createAsyncThunk<DBCard[], SplitHandParams>(
  "players/splitHand",
  async () => {
    const response = await Deck.deal(2);
    return response;
  }
);

type SwapCardsParams = Omit<ThunkParams, "hNum" | "num" | "weigh"> & {
  cardsToDiscard: number[];
};
/** iterate through array, removing each index number from hand
 * then add new cards to the hand
 * @param {Object[]} hands - pass in player's hands to be mutated with new card
 * @param {number} id - tells us which player to update
 * @param {array} cardsToDiscard - array of index numbers
 * @return {Object}
 */
export const swapCards = createAsyncThunk<DBCard[], SwapCardsParams>(
  "players/swapCards",
  async ({ cardsToDiscard }) => {
    const response = await Deck.deal(cardsToDiscard.length);
    return response;
  }
);
