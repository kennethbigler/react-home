import { atomWithStorage } from "jotai/utils";

export const MIN_BID = 0;
export const MAX_BID = 13;

interface Bid {
  bid: number;
  blind: boolean;
  train: boolean;
}
export type Bids = [Bid, Bid, Bid, Bid];

export interface ScoreRow {
  /** initial of who went first */
  start: string;
  /** Bids converted to a string */
  bid: string;
  /** team 1's score */
  score1?: number;
  /** team 1's bags */
  bags1?: number;
  /** team 1's lost point modifiers */
  mod1?: string;
  /** team 2's score */
  score2?: number;
  /** team 2's bags */
  bags2?: number;
  /** team 2's lost point modifiers */
  mod2?: string;
}

interface SpadesState {
  /** score table, updates on +Score & +Bid, resets over games */
  data: ScoreRow[];
  /** 0, 1, 2, 3, updates on +Score, persists over games */
  first: number;
  /** recent bids */
  lastBid: Bids;
  /** over bid tracker over time */
  overBids: [number, number, number, number];
  /** team 1 wins */
  wins1: number;
  /** team 2 wins */
  wins2: number;
}

export const defaultBid: Bid = { bid: 3, blind: false, train: false };
const initialState: SpadesState = {
  data: [],
  first: 0,
  lastBid: [defaultBid, defaultBid, defaultBid, defaultBid],
  overBids: [0, 0, 0, 0],
  wins1: 0,
  wins2: 0,
};

const spadesAtom = atomWithStorage("spadesAtom", initialState);

export default spadesAtom;
