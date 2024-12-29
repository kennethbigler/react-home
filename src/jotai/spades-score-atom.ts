import { atomWithStorage } from "jotai/utils";

export interface Bid {
  bid: number;
  blind: boolean;
  train: boolean;
}
export type Bids = [Bid, Bid, Bid, Bid];

export interface ScoreRow {
  first: string;
  bid: string;
  score1?: number;
  score2?: number;
}

interface ScoreboardState {
  /** 0, 1, 2, 3, updates on +Score, persists over games */
  first: number;
  /** recent bids */
  lastBid: Bids;
  /** score table, updates on +Score & +Bid, resets over games */
  data: ScoreRow[];
}

export const defaultBid: Bid = { bid: 0, blind: false, train: false };
const initialState: ScoreboardState = {
  first: 0,
  lastBid: [defaultBid, defaultBid, defaultBid, defaultBid],
  data: [],
};

const scoreboardAtom = atomWithStorage("scoreboardAtom", initialState);

export default scoreboardAtom;
