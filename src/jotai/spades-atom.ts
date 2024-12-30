import { atomWithStorage } from "jotai/utils";

export const MIN_BID = 0;
export const MAX_BID = 13;

export interface Bid {
  bid: number;
  blind: boolean;
  train: boolean;
}
export type Bids = [Bid, Bid, Bid, Bid];

export interface ScoreRow {
  start: string;
  bid: string;
  score1?: number;
  bags1?: number;
  score2?: number;
  bags2?: number;
}

interface SpadesState {
  /** 0, 1, 2, 3, updates on +Score, persists over games */
  first: number;
  /** recent bids */
  lastBid: Bids;
  /** score table, updates on +Score & +Bid, resets over games */
  data: ScoreRow[];
}

export const defaultBid: Bid = { bid: 3, blind: false, train: false };
const initialState: SpadesState = {
  first: 0,
  lastBid: [defaultBid, defaultBid, defaultBid, defaultBid],
  data: [],
};

const spadesAtom = atomWithStorage("spadesAtom", initialState);

export default spadesAtom;
