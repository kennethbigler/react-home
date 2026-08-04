import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import bridgeAtom, { bridgeRead } from "../../../../../jotai/bridge-atom";
import type { PendingContract } from "../../../../../jotai/bridge-atom";
import {
  deriveSituation,
  getFinalContractDeclarerSeat,
  getFinalContractInfo,
  getRecommendation,
  getRelatives,
} from "./advisor/bidding-logic";
import type {
  AuctionState,
  BidRecommendation as BidRecommendationType,
  Hand,
  Vulnerability,
} from "./advisor/bidding-logic";
import AuctionContextInput from "./advisor/AuctionContext";
import BidRecommendation from "./advisor/BidRecommendation";
import HandInput from "./advisor/HandInput";

const DEFAULT_HAND: Hand = {
  hcp: 0,
  spades: 3,
  hearts: 3,
  diamonds: 4,
  clubs: 3,
};

const DEFAULT_STATE: AuctionState = {
  myPosition: 1,
  completedRounds: [],
  currentRound: {},
};

// Maps a contract bid's plain suit symbol to the emoji variant the Score form
// uses for its dropdown options.  NT passes through unchanged.
const CONTRACT_SUIT_TO_FORM: Record<string, string> = {
  "♠": "♠️",
  "♥": "♥️",
  "♦": "♦️",
  "♣": "♣️",
};

/** Parse a final-contract string (e.g. "3♠", "1NT") into the Score form's
 *  suit option + trick level.  Returns null if it can't be parsed. */
function parseContract(
  contract: string,
): { suit: string; tricks: number } | null {
  const tricks = parseInt(contract[0], 10);
  if (!tricks) return null;
  const rest = contract.slice(1);
  if (rest === "NT") return { suit: "NT", tricks };
  const suit = CONTRACT_SUIT_TO_FORM[rest];
  return suit ? { suit, tricks } : null;
}

export default function BidAdvisor() {
  const [hand, setHand] = useState<Hand>(DEFAULT_HAND);
  const [auctionState, setAuctionState] = useState<AuctionState>(DEFAULT_STATE);

  const { weVulnerable, theyVulnerable } = useAtomValue(bridgeRead);
  const vulnerability: Vulnerability =
    weVulnerable && theyVulnerable
      ? "both"
      : weVulnerable
        ? "we-only"
        : theyVulnerable
          ? "they-only"
          : "none";

  const totalCards = hand.spades + hand.hearts + hand.diamonds + hand.clubs;
  const handIsValid = totalCards === 13;

  // Bidding is over once three passes follow a bid (or the deal is passed out).
  // When complete there is nothing left to advise — we show the final contract
  // instead of a bid, and never ask about stoppers.
  const { isComplete: biddingComplete, finalContract } = getFinalContractInfo(
    auctionState.completedRounds,
    auctionState.currentRound,
    auctionState.myPosition,
  );

  const auctionContext = useMemo(
    () => deriveSituation(auctionState, vulnerability),
    [auctionState, vulnerability],
  );
  // Keep the aces input visible through the ENTIRE Blackwood sequence — the
  // kings follow-up needs the ace count to veto a grand slam with an ace
  // missing.
  const isBlackwoodAsk =
    auctionContext.situation === "blackwood-ace-response" ||
    auctionContext.situation === "blackwood-response" ||
    auctionContext.situation === "blackwood-kings";
  const isBlackwoodKings =
    auctionContext.situation === "blackwood-kings-response" ||
    auctionContext.situation === "blackwood-kings";

  // Show stopper question when there is an opponent suit in play.
  // We look for a suit bid by RHO (or LHO if they opened and we're competing).
  // Exclude conventional bids that look like suit bids but are not natural:
  //   • 2♣ Stayman — when LHO or RHO opened NT and partner/RHO replied 2♣
  const lhoIsNT = auctionContext.lhoBid?.endsWith("NT") ?? false;
  const rhoIsNT = auctionContext.rhoBid?.endsWith("NT") ?? false;
  const isConventional2C = (bid: string) =>
    bid === "2♣" && (lhoIsNT || rhoIsNT);
  const opponentSuitBid =
    (auctionContext.rhoBid?.match(/[♠♥♦♣]/) &&
    !isConventional2C(auctionContext.rhoBid)
      ? auctionContext.rhoBid
      : null) ??
    (auctionContext.lhoBid?.match(/[♠♥♦♣]/) &&
    !isConventional2C(auctionContext.lhoBid)
      ? auctionContext.lhoBid
      : null);
  const isOpponentSuitBid =
    opponentSuitBid !== null && !opponentSuitBid.endsWith("NT");
  const opponentSuitName = isOpponentSuitBid
    ? opponentSuitBid!.includes("♠")
      ? "spades"
      : opponentSuitBid!.includes("♥")
        ? "hearts"
        : opponentSuitBid!.includes("♦")
          ? "diamonds"
          : "clubs"
    : null;
  const opponentSuitSymbol = opponentSuitName
    ? (opponentSuitBid!.match(/[♠♥♦♣]/)?.[0] ?? "")
    : "";

  // Only show stopper input in situations where NT bids require a stopper
  const stopperSituations: string[] = [
    "responding-1nt", // responding to partner's 1NT with opponent interference
    "responding-to-simple-oc", // responding to partner's overcall
    "responding-to-jump-oc",
    "responding-to-double", // responding to partner's takeout double
    "overcalling", // we are overcalling an opponent's bid
    "rebid-after-negative-double", // opener rebids after partner's negative double
    "responding-weak2", // responding to partner's weak 2 with interference
  ];
  // Only ask about the stopper when it would actually CHANGE the recommended
  // bid.  Compute the recommendation both with and without a stopper; if the
  // bid is the same either way (e.g. a weak hand that passes regardless), the
  // question is pointless noise, so suppress it.
  const stopperCouldMatter =
    isOpponentSuitBid && stopperSituations.includes(auctionContext.situation);
  const stopperChangesBid = useMemo(() => {
    if (!stopperCouldMatter || !handIsValid) return false;
    const withStopper = getRecommendation(
      { ...hand, hasStopperInOpponentSuit: true },
      auctionContext,
    );
    const withoutStopper = getRecommendation(
      { ...hand, hasStopperInOpponentSuit: false },
      auctionContext,
    );
    return withStopper.bid !== withoutStopper.bid;
  }, [hand, auctionContext, stopperCouldMatter, handIsValid]);
  const showStopperInput =
    stopperCouldMatter && stopperChangesBid && !biddingComplete;

  const opponentSuitLabel = opponentSuitName
    ? `${opponentSuitSymbol} ${opponentSuitName}`
    : "the opponent's suit";

  // ── Suit-quality question (weak-2 / preempt openings) ────────────────────────
  // SAYC preempts require a GOOD suit, but the tool only knows length + HCP.
  // Ask about suit quality ONLY in the preempt zone (an opening bid, a 6+ card
  // longest suit, 5–10 HCP) and ONLY when the answer would change the bid —
  // same compute-both-ways gating used for the stopper question above.
  const longestSuitLength = Math.max(
    hand.spades,
    hand.hearts,
    hand.diamonds,
    hand.clubs,
  );
  const qualityCouldMatter =
    (auctionContext.situation === "opening" ||
      auctionContext.situation === "overcalling") &&
    longestSuitLength >= 6 &&
    hand.hcp >= 5 &&
    hand.hcp <= 10;
  const qualityChangesBid = useMemo(() => {
    if (!qualityCouldMatter || !handIsValid) return false;
    const good = getRecommendation(
      { ...hand, goodSuitQuality: true },
      auctionContext,
    );
    const poor = getRecommendation(
      { ...hand, goodSuitQuality: false },
      auctionContext,
    );
    return good.bid !== poor.bid;
  }, [hand, auctionContext, qualityCouldMatter, handIsValid]);
  const showSuitQualityInput =
    qualityCouldMatter && qualityChangesBid && !biddingComplete;
  const longestSuitName =
    longestSuitLength === hand.spades
      ? "spades"
      : longestSuitLength === hand.hearts
        ? "hearts"
        : longestSuitLength === hand.diamonds
          ? "diamonds"
          : "clubs";

  const recommendation = useMemo<BidRecommendationType | null>(() => {
    if (!handIsValid) return null;
    const context = deriveSituation(auctionState, vulnerability);
    // Strip hasStopperInOpponentSuit when the stopper question is not shown so
    // stale data from a previous auction state doesn't skew the recommendation.
    const effectiveHand: Hand = {
      ...hand,
      // Strip each conditional input when its question is not shown, so stale
      // data from a previous auction state can't skew the recommendation.
      hasStopperInOpponentSuit: showStopperInput
        ? hand.hasStopperInOpponentSuit
        : undefined,
      goodSuitQuality: showSuitQualityInput ? hand.goodSuitQuality : undefined,
    };
    return getRecommendation(effectiveHand, context);
  }, [
    hand,
    auctionState,
    handIsValid,
    vulnerability,
    showStopperInput,
    showSuitQualityInput,
  ]);

  // Hand the CURRENTLY DISPLAYED auction's contract to the Score modal so it can
  // pre-fill suit/level/side.  This must track the live auction in both
  // directions: set it when the auction is complete, and CLEAR it when it is not
  // — otherwise a contract from a previous (now-abandoned) auction lingers in
  // the atom and the Score modal pre-fills a stale bid (e.g. an old 3♦ showing
  // up after a 1NT auction or a New Game reset).
  const setBridgeState = useSetAtom(bridgeAtom);
  useEffect(() => {
    let pendingContract: PendingContract | null = null;
    if (biddingComplete && finalContract) {
      const parsed = parseContract(finalContract);
      if (parsed) {
        const declarerSeat = getFinalContractDeclarerSeat(
          auctionState.completedRounds,
          auctionState.currentRound,
          auctionState.myPosition,
        );
        const { partner } = getRelatives(auctionState.myPosition);
        const isWe =
          declarerSeat === auctionState.myPosition || declarerSeat === partner;
        pendingContract = { ...parsed, isWe };
      }
    }
    // Only write when the value actually changes, to avoid an update loop.
    setBridgeState((prev) => {
      const a = prev.pendingContract ?? null;
      const same =
        a === pendingContract ||
        (!!a &&
          !!pendingContract &&
          a.suit === pendingContract.suit &&
          a.tricks === pendingContract.tricks &&
          a.isWe === pendingContract.isWe);
      return same ? prev : { ...prev, pendingContract };
    });
  }, [biddingComplete, finalContract, auctionState, setBridgeState]);

  return (
    <Box>
      {/* The "New Game" reset lives in the dialog's top bar. */}
      <Grid container spacing={2}>
        {/* ── Column 1: hand ──────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <HandInput
              hand={hand}
              onChange={setHand}
              showAcesInput={isBlackwoodAsk}
              showKingsInput={isBlackwoodKings}
              showStopperInput={showStopperInput}
              opponentSuitLabel={opponentSuitLabel}
              showSuitQualityInput={showSuitQualityInput}
              longSuitLabel={longestSuitName}
            />
          </Paper>
        </Grid>

        {/* ── Column 2: auction context ───────────────────────────────── */}
        {/* Once bidding is complete there is no recommendation to show, so the
            recommendation column is hidden and this one widens to fill it. */}
        <Grid size={{ xs: 12, md: biddingComplete ? 8 : 4 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <AuctionContextInput
              state={auctionState}
              onChange={setAuctionState}
              weVulnerable={weVulnerable}
              theyVulnerable={theyVulnerable}
              recommendedBid={recommendation?.bid}
            />
          </Paper>
        </Grid>

        {/* ── Column 3: recommendation (hidden when bidding is complete) ── */}
        {!biddingComplete && (
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              variant="outlined"
              sx={{ p: 2, minHeight: 200, position: "sticky", top: 0 }}
            >
              {recommendation ? (
                <BidRecommendation recommendation={recommendation} />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 200,
                    gap: 1,
                    color: "text.secondary",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Recommendation
                  </Typography>
                  <Divider sx={{ width: "80%" }} />
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    Enter your hand above (cards must total 13) to see your bid
                    recommendation.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
