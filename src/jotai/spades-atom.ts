import { atomWithStorage } from "jotai/utils";

export const MIN_BID = 0;
export const MAX_BID = 13;

export interface Bid {
  bid: number;
  blind: boolean;
  train: boolean;
}
/** Tuple of one bid per player, in seat order */
export type Bids = [Bid, Bid, Bid, Bid];
/** Per-player nil stats: [times bid, times bid blind, times won] */
export type NilMetrics = [
  [bid: number, blind: number, won: number],
  [bid: number, blind: number, won: number],
  [bid: number, blind: number, won: number],
  [bid: number, blind: number, won: number],
];

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
  /** lifetime under-bid (bag) count per player, plus expected bags accumulator */
  lifeBags: [p1: number, p2: number, p3: number, p4: number, expected: number];
  /** lifetime over-bid (missed bid) count per player */
  missedBids: [p1: number, p2: number, p3: number, p4: number];
  /** team 1 wins */
  wins1: number;
  /** team 2 wins */
  wins2: number;
  /** team 1 running total */
  total1: number;
  /** team 2 running total */
  total2: number;
  /** per-player nil stats */
  nils: NilMetrics;
}

/** Default bid used when initializing or resetting bids */
export const defaultBid: Readonly<Bid> = { bid: 3, blind: false, train: false };
const initialState: SpadesState = {
  data: [],
  first: 0,
  lastBid: [defaultBid, defaultBid, defaultBid, defaultBid],
  lifeBags: [0, 0, 0, 0, 0],
  missedBids: [0, 0, 0, 0],
  wins1: 0,
  wins2: 0,
  total1: 0,
  total2: 0,
  nils: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
};

const spadesAtom = atomWithStorage("spadesAtom", initialState);

export default spadesAtom;
