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

  const recommendation = useMemo<BidRecommendationType | null>(() => {
    if (!handIsValid) return null;
    const context = deriveSituation(auctionState, vulnerability);
    return getRecommendation(hand, context);
  }, [hand, auctionState, handIsValid, vulnerability]);

  const auctionContext = useMemo(
    () => deriveSituation(auctionState, vulnerability),
    [auctionState, vulnerability],
  );
  const isBlackwoodAsk =
    auctionContext.situation === "blackwood-ace-response" ||
    auctionContext.situation === "blackwood-response";
  const isBlackwoodKings =
    auctionContext.situation === "blackwood-kings-response";

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
