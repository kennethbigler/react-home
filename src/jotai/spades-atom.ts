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
  start: string;
  bid: string;
  score1?: number;
  bags1?: number;
  mod1?: string;
  score2?: number;
  bags2?: number;
  mod2?: string;
}

interface SpadesState {
  /** bag tracker over time */
  bags: [number, number, number, number];
  /** score table, updates on +Score & +Bid, resets over games */
  data: ScoreRow[];
  /** 0, 1, 2, 3, updates on +Score, persists over games */
  first: number;
  /** recent bids */
  lastBid: Bids;
  /** team 1 wins */
  wins1: number;
  /** team 2 wins */
  wins2: number;
}

export const defaultBid: Bid = { bid: 3, blind: false, train: false };
const initialState: SpadesState = {
  bags: [0, 0, 0, 0],
  data: [],
  first: 0,
  lastBid: [defaultBid, defaultBid, defaultBid, defaultBid],
  wins1: 0,
  wins2: 0,
};

const spadesAtom = atomWithStorage("spadesAtom", initialState);

export default spadesAtom;
