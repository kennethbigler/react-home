import { Box, Chip, Divider, Grid, Paper, Typography } from "@mui/material";
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

  const recommendation = useMemo<BidRecommendationType | null>(() => {
    if (!handIsValid) return null;
    const context = deriveSituation(auctionState, vulnerability);
    // Strip hasStopperInOpponentSuit when the stopper question is not shown so
    // stale data from a previous auction state doesn't skew the recommendation.
    const effectiveHand: Hand = showStopperInput
      ? hand
      : { ...hand, hasStopperInOpponentSuit: undefined };
    return getRecommendation(effectiveHand, context);
  }, [hand, auctionState, handIsValid, vulnerability, showStopperInput]);

  // When the auction settles on a contract, hand it off to the Score modal so it
  // can pre-fill the contract suit, level, and declaring side.  The Score modal
  // consumes (and clears) this when it opens; it stays fully editable there.
  const setBridgeState = useSetAtom(bridgeAtom);
  useEffect(() => {
    if (!biddingComplete || !finalContract) return;
    const parsed = parseContract(finalContract);
    if (!parsed) return;
    const declarerSeat = getFinalContractDeclarerSeat(
      auctionState.completedRounds,
      auctionState.currentRound,
      auctionState.myPosition,
    );
    const { partner } = getRelatives(auctionState.myPosition);
    const isWe =
      declarerSeat === auctionState.myPosition || declarerSeat === partner;
    const pendingContract: PendingContract = { ...parsed, isWe };
    setBridgeState((prev) => ({ ...prev, pendingContract }));
  }, [biddingComplete, finalContract, auctionState, setBridgeState]);

  return (
    <Box>
      {/* Header (the "New Game" reset lives in the dialog's top bar) */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Bid Advisor
      </Typography>
      <Grid container spacing={2}>
        {/* ── Left column: hand + context ─────────────────────────────── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <HandInput
              hand={hand}
              onChange={setHand}
              showAcesInput={isBlackwoodAsk}
              showKingsInput={isBlackwoodKings}
              showStopperInput={showStopperInput}
              opponentSuitLabel={opponentSuitLabel}
            />
          </Paper>
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

        {/* ── Right column: recommendation ────────────────────────────── */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            variant="outlined"
            sx={{ p: 2, minHeight: 200, position: "sticky", top: 0 }}
          >
            {biddingComplete ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Bidding Complete
                </Typography>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    variant="h4"
                    component="span"
                    aria-label="Final contract"
                    sx={{ fontWeight: "bold" }}
                  >
                    {finalContract ?? "Passed Out"}
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "text.secondary" }}
                    >
                      {finalContract
                        ? "Final contract"
                        : "No contract — all four players passed"}
                    </Typography>
                    <Chip label="Auction over" color="info" size="small" />
                  </Box>
                </Paper>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Three passes have ended the auction, so there are no more bids
                  to make. Use New Game (top bar) to advise another hand.
                </Typography>
              </Box>
            ) : recommendation ? (
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
      </Grid>
    </Box>
  );
}
