// SAYC (Standard American Yellow Card) Bidding Advisor
// System: 5-card majors, 15-17 1NT, based on No Fear Bridge cheat sheet
// Additional conventions validated against ACBL SAYC and BridgeBum

// This file is the public entry point for the bidding advisor. The engine
// itself lives in ./bidding/* — split by auction phase (openings, responses,
// overcalls, rebids, conventions) plus shared types/helpers and the
// situation-derivation layer. Import from this barrel, not the submodules.

export type {
  AuctionContext,
  AuctionState,
  BidRecommendation,
  BiddingPosition,
  BidRound,
  Hand,
  Vulnerability,
} from "./bidding/types";
export {
  analyzeHand,
  bestMajor,
  calcLongSuitPoints,
  calcShortSuitPoints,
  calcTP,
  calcTPWithFit,
  getContractLimit,
  hasFiveCardMajor,
  hasVoid,
  isBalanced,
  longerMinor,
  longestSuitInfo,
  ruleOf20,
  suitBidLevel,
  suitSymbol,
} from "./bidding/hand-evaluation";
export { getValidBidsAfter } from "./bidding/bid-order";
export { getRelatives } from "./bidding/positions";
export { getRecommendation } from "./bidding/router";
export { getBidMeaning } from "./bidding/bid-meaning";
export {
  deriveSituation,
  getFinalContractDeclarerSeat,
  getFinalContractInfo,
} from "./bidding/derive-situation";
