import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import { bridgeRead } from "../../../../../jotai/bridge-atom";
import { deriveSituation, getRecommendation } from "./advisor/bidding-logic";
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

  const auctionContext = useMemo(
    () => deriveSituation(auctionState, vulnerability),
    [auctionState, vulnerability],
  );
  const isBlackwoodAsk =
    auctionContext.situation === "blackwood-ace-response" ||
    auctionContext.situation === "blackwood-response";
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
  // Also require at least 6 HCP — below that, Pass is certain regardless of stoppers,
  // so asking the stopper question is pointless noise.
  const showStopperInput =
    isOpponentSuitBid &&
    stopperSituations.includes(auctionContext.situation) &&
    hand.hcp >= 6;

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

  const handleNewGame = () => {
    setHand(DEFAULT_HAND);
    setAuctionState(DEFAULT_STATE);
  };

  return (
    <Box>
      {/* Header row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Bid Advisor</Typography>
        <Button
          onClick={handleNewGame}
          variant="outlined"
          size="small"
          color="secondary"
        >
          New Game
        </Button>
      </Box>

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
                <Typography variant="h6" color="text.secondary">
                  Recommendation
                </Typography>
                <Divider sx={{ width: "80%" }} />
                <Typography variant="body2" textAlign="center">
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
