import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  ClickAwayListener,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, type Theme } from "@mui/material/styles";
import { useState } from "react";
import type { AuctionState, BidRound, BiddingPosition } from "./bidding-logic";
import {
  getBidMeaning,
  getFinalContractInfo,
  getRelatives,
  getValidBidsAfter,
} from "./bidding-logic";
import { colorSuits } from "../../../suitColor";

// ─── Props ────────────────────────────────────────────────────────────────────

interface AuctionContextProps {
  state: AuctionState;
  onChange: (state: AuctionState) => void;
  weVulnerable: boolean;
  theyVulnerable: boolean;
  recommendedBid?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const POSITION_LABELS: Record<BiddingPosition, string> = {
  1: "1st",
  2: "2nd",
  3: "3rd",
  4: "4th",
};

const AGREED_SUIT_OPTIONS = ["♠", "♥", "♦", "♣"];

// ─── Helper: last non-pass bid up to a slot index ─────────────────────────────

function lastSignificantBid(
  completedRounds: BidRound[],
  currentRound: BidRound,
  upToPositionExclusive: BiddingPosition,
  slotPositions: BiddingPosition[],
): string | undefined {
  let last: string | undefined;
  for (const round of completedRounds) {
    for (const pos of [1, 2, 3, 4] as BiddingPosition[]) {
      const b = round[pos];
      if (b && b !== "Pass") last = b;
    }
  }
  for (const pos of slotPositions) {
    if (pos >= upToPositionExclusive) break;
    const b = currentRound[pos];
    if (!b) continue;
    if (b !== "Pass") last = b;
  }
  return last;
}

/** Like lastSignificantBid but skips Double/Redouble — returns only suit/NT bids.
 *  Used to compute the floor for valid suit bids after a Double or Redouble. */
function lastSuitBid(
  completedRounds: BidRound[],
  currentRound: BidRound,
  upToPositionExclusive: BiddingPosition,
  slotPositions: BiddingPosition[],
): string | undefined {
  let last: string | undefined;
  for (const round of completedRounds) {
    for (const pos of [1, 2, 3, 4] as BiddingPosition[]) {
      const b = round[pos];
      if (b && b !== "Pass" && b !== "Double" && b !== "Redouble") last = b;
    }
  }
  for (const pos of slotPositions) {
    if (pos >= upToPositionExclusive) break;
    const b = currentRound[pos];
    if (!b) continue;
    if (b !== "Pass" && b !== "Double" && b !== "Redouble") last = b;
  }
  return last;
}

// ─── Bidder-history helper ─────────────────────────────────────────────────────

/**
 * The seat's most recent REAL bid within `rounds` (and optionally `extra`,
 * e.g. the in-progress round).  Used so tooltips can distinguish an opening
 * (e.g. "weak 2♠") from a rebid of a suit the player already showed.
 */
function lastRealBidBySeat(
  rounds: BidRound[],
  extra: BidRound | undefined,
  pos: BiddingPosition,
): string | undefined {
  let out: string | undefined;
  for (const r of rounds) {
    const b = r[pos];
    if (b && b !== "Pass" && b !== "Double" && b !== "Redouble") out = b;
  }
  const e = extra?.[pos];
  if (e && e !== "Pass" && e !== "Double" && e !== "Redouble") out = e;
  return out;
}

/** Like lastRealBidBySeat, but a Double/Redouble also counts as the seat's
 *  last action — a takeout double is the context an advance responds to. */
function lastActionBySeat(
  rounds: BidRound[],
  extra: BidRound | undefined,
  pos: BiddingPosition,
): string | undefined {
  let out: string | undefined;
  for (const r of rounds) {
    const b = r[pos];
    if (b && b !== "Pass") out = b;
  }
  const e = extra?.[pos];
  if (e && e !== "Pass") out = e;
  return out;
}

/** The slice of a round containing only the seats that bid BEFORE `pos`.
 *  Threaded into the history helpers as the in-progress round so a bid is
 *  read in the context of earlier seats in its OWN round — not just prior
 *  completed rounds.  Without this, partner's same-round bid is invisible and
 *  a raise reads as a "second suit" / a response reads as an "overcall". */
function roundBefore(round: BidRound, pos: BiddingPosition): BidRound {
  const out: BidRound = {};
  for (let p = 1; p < pos; p++) {
    const b = round[p as BiddingPosition];
    if (b !== undefined) out[p as BiddingPosition] = b;
  }
  return out;
}

/** The first real bid of the auction (bid values are unique, so equality
 *  against this identifies openings exactly). */
function auctionOpeningBidOf(
  rounds: BidRound[],
  extra?: BidRound,
): string | undefined {
  for (const r of [...rounds, extra ?? {}]) {
    for (const p of [1, 2, 3, 4] as BiddingPosition[]) {
      const b = r[p];
      if (b && b !== "Pass" && b !== "Double" && b !== "Redouble") return b;
    }
  }
  return undefined;
}

// ─── Relationship label helpers ───────────────────────────────────────────────

type Relationship = "partner" | "lho" | "rho";

function getRelationshipLabel(
  pos: BiddingPosition,
  myPosition: BiddingPosition,
): string {
  const { partner, lho, rho } = getRelatives(myPosition);
  if (pos === partner) return `Partner (${POSITION_LABELS[pos]})`;
  if (pos === rho) return `RHO (${POSITION_LABELS[pos]})`;
  if (pos === lho) return `LHO (${POSITION_LABELS[pos]})`;
  return POSITION_LABELS[pos];
}

function getRelationship(
  pos: BiddingPosition,
  myPosition: BiddingPosition,
): Relationship {
  const { partner, lho } = getRelatives(myPosition);
  if (pos === partner) return "partner";
  if (pos === lho) return "lho";
  return "rho";
}

// ─── Partnership (side) helpers ────────────────────────────────────────────────
// Seats pair up as {1,3} and {2,4}.  "us" = me + my partner, "them" = the two
// opponents.  Coloring seats by side makes it easy to see where my bid and my
// partner's bid sit, versus the opponents'.

type Side = "us" | "them";

function getSide(pos: BiddingPosition, myPosition: BiddingPosition): Side {
  const { partner } = getRelatives(myPosition);
  return pos === myPosition || pos === partner ? "us" : "them";
}

/** sx fragment that tints a seat by partnership side. Uses alpha over the
 *  primary color so it reads correctly in both light and dark themes. */
function sideSx(side: Side) {
  return side === "us"
    ? {
        backgroundColor: (t: Theme) => alpha(t.palette.primary.main, 0.12),
        borderColor: "primary.main",
      }
    : {
        backgroundColor: "action.hover",
        borderColor: "divider",
      };
}

// ─── Info icon with tooltip ────────────────────────────────────────────────────

interface BidInfoIconProps {
  bid: string;
  relationship: Relationship;
  prevHighBid?: string;
  bidderPreviousBid?: string;
  bidderPartnerPreviousBid?: string;
  auctionOpeningBid?: string;
}

function BidInfoIcon({
  bid,
  relationship,
  prevHighBid,
  bidderPreviousBid,
  bidderPartnerPreviousBid,
  auctionOpeningBid,
}: BidInfoIconProps) {
  const [open, setOpen] = useState(false);
  if (!bid) return null;
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Tooltip
        title={getBidMeaning(
          bid,
          relationship,
          prevHighBid,
          bidderPreviousBid,
          bidderPartnerPreviousBid,
          auctionOpeningBid,
        )}
        placement="right"
        arrow
        open={open}
        disableHoverListener
        disableFocusListener
        disableTouchListener
        slotProps={{
          popper: { disablePortal: true },
        }}
      >
        <IconButton
          size="small"
          sx={{
            p: 0.25,
            color: open ? "primary.main" : "text.secondary",
            transition: "color 0.15s",
          }}
          aria-label={`${open ? "Hide" : "Show"} info about ${bid}`}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <InfoOutlinedIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </ClickAwayListener>
  );
}

// ─── Single bid dropdown with info icon ────────────────────────────────────────

interface BidSlotProps {
  slotLabel: string;
  relationship: Relationship | "me";
  value: string;
  options: string[];
  onChange: (val: string) => void;
  prevHighBid?: string;
  bidderPreviousBid?: string;
  bidderPartnerPreviousBid?: string;
  auctionOpeningBid?: string;
}

function BidSlot({
  slotLabel,
  relationship,
  value,
  options,
  onChange,
  prevHighBid,
  bidderPreviousBid,
  bidderPartnerPreviousBid,
  auctionOpeningBid,
}: BidSlotProps) {
  const currentValue = value || "Pass";
  const labelId = `bid-label-${slotLabel.replace(/[\s()]+/g, "-").toLowerCase()}`;
  // "me" and "partner" are on your side; "lho"/"rho" are opponents.  A colored
  // left edge ties each slot to its partnership; the "you" slot is also labeled.
  const side: Side =
    relationship === "me" || relationship === "partner" ? "us" : "them";
  const cue = relationship === "me" ? "you" : undefined;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        pl: 1,
        borderLeft: "3px solid",
        borderLeftColor: side === "us" ? "primary.main" : "divider",
        borderRadius: 0.5,
      }}
    >
      <FormControl sx={{ flex: 1 }} size="small">
        <InputLabel id={labelId}>{slotLabel}</InputLabel>
        <Select
          labelId={labelId}
          label={slotLabel}
          value={currentValue}
          onChange={(e) => onChange(e.target.value)}
          slotProps={{ input: { "aria-label": slotLabel } }}
        >
          {options.map((b) => (
            <MenuItem key={b} value={b}>
              {colorSuits(b)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {cue && (
        <Typography
          variant="caption"
          sx={{
            color: side === "us" ? "primary.main" : "text.secondary",
            whiteSpace: "nowrap",
            fontWeight: relationship === "me" ? 600 : 400,
          }}
        >
          {cue}
        </Typography>
      )}
      {relationship !== "me" && (
        <BidInfoIcon
          bid={currentValue}
          relationship={relationship as Relationship}
          prevHighBid={prevHighBid}
          bidderPreviousBid={bidderPreviousBid}
          bidderPartnerPreviousBid={bidderPartnerPreviousBid}
          auctionOpeningBid={auctionOpeningBid}
        />
      )}
    </Box>
  );
}

// ─── Single bid chip with tap-to-toggle tooltip ───────────────────────────────

interface BidChipProps {
  chipLabel: string;
  tooltipTitle: string;
  isMe: boolean;
  side: Side;
}

function BidChip({ chipLabel, tooltipTitle, isMe, side }: BidChipProps) {
  const [open, setOpen] = useState(false);
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Tooltip
        title={tooltipTitle}
        placement="top"
        arrow
        open={open}
        disableHoverListener
        disableFocusListener
        disableTouchListener
        slotProps={{
          popper: { disablePortal: true },
        }}
      >
        <Chip
          label={colorSuits(chipLabel)}
          size="small"
          variant={isMe ? "filled" : "outlined"}
          color={isMe ? "primary" : "default"}
          sx={{
            fontSize: "0.7rem",
            cursor: "pointer",
            // Tint by partnership side so your side's bids stand apart from the
            // opponents'.  "Me" stays filled-primary and is left untouched.
            ...(isMe ? {} : sideSx(side)),
            outline: open ? "2px solid" : "none",
            outlineColor: "primary.main",
            outlineOffset: "2px",
          }}
          aria-expanded={open}
          aria-label={`${chipLabel} — tap to ${open ? "hide" : "show"} meaning`}
          onClick={() => setOpen((v) => !v)}
        />
      </Tooltip>
    </ClickAwayListener>
  );
}

// ─── Completed round row (read-only chips with tooltips) ──────────────────────

interface CompletedRoundRowProps {
  round: BidRound;
  roundIndex: number;
  myPosition: BiddingPosition;
  allCompletedRounds: BidRound[];
}

function CompletedRoundRow({
  round,
  roundIndex,
  myPosition,
  allCompletedRounds,
}: CompletedRoundRowProps) {
  return (
    <Box
      sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}
    >
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          minWidth: 60,
        }}
      >
        Round {roundIndex + 1}:
      </Typography>
      {/* Only show seats that actually acted this round.  A round that ended
          the auction may hold fewer than 4 calls (bidding stops after the 3rd
          consecutive pass), so iterate the seats present rather than 1-4. */}
      {([1, 2, 3, 4] as BiddingPosition[])
        .filter((pos) => round[pos] !== undefined)
        .map((pos) => {
          const isMe = pos === myPosition;
          const bid = round[pos] ?? "Pass";
          const rel = isMe ? "partner" : getRelationship(pos, myPosition);

          // Compute the last real bid before this position for context-aware tooltips
          const prevHighBid = (() => {
            for (let p = pos - 1; p >= 1; p--) {
              const b = round[p as BiddingPosition];
              if (b && b !== "Pass" && b !== "Double" && b !== "Redouble")
                return b;
            }
            for (let r = roundIndex - 1; r >= 0; r--) {
              const pr = allCompletedRounds[r];
              for (let p = 4; p >= 1; p--) {
                const b = pr[p as BiddingPosition];
                if (b && b !== "Pass" && b !== "Double" && b !== "Redouble")
                  return b;
              }
            }
            return undefined;
          })();

          const chipLabel = `${isMe ? "Me" : getRelationshipLabel(pos, myPosition)}: ${bid}`;
          // History before this seat's turn = all prior completed rounds PLUS the
          // earlier seats in THIS round.  Threading the same-round earlier bids is
          // what lets the tooltip see partner's bid made earlier this round (so a
          // raise is not mislabeled a "second suit", nor a response an "overcall").
          const priorRounds = allCompletedRounds.slice(0, roundIndex);
          const thisRoundBefore = roundBefore(round, pos);
          // The seat's own previous real bid — lets the tooltip describe a REBID
          // instead of mislabeling it as an opening.
          const bidderPreviousBid = lastRealBidBySeat(
            priorRounds,
            thisRoundBefore,
            pos,
          );
          const bidderPartnerPreviousBid =
            lastActionBySeat(
              priorRounds,
              thisRoundBefore,
              getRelatives(pos).partner,
            ) ?? "none"; // "none" = known to have no previous action
          const tooltipTitle = getBidMeaning(
            bid,
            rel as Relationship,
            prevHighBid,
            bidderPreviousBid,
            bidderPartnerPreviousBid,
            auctionOpeningBidOf(allCompletedRounds),
          );

          return (
            <BidChip
              key={pos}
              chipLabel={chipLabel}
              tooltipTitle={tooltipTitle}
              isMe={isMe}
              side={getSide(pos, myPosition)}
            />
          );
        })}
    </Box>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function AuctionContextInput({
  state,
  onChange,
  weVulnerable,
  theyVulnerable,
  recommendedBid,
}: AuctionContextProps) {
  const { myPosition, completedRounds, currentRound, agreedSuit } = state;

  const [nextRoundBids, setNextRoundBids] = useState<BidRound>({});

  const update = (partial: Partial<AuctionState>) =>
    onChange({ ...state, ...partial });

  const updateCurrentRound = (pos: BiddingPosition, bid: string) => {
    update({ currentRound: { ...currentRound, [pos]: bid || "Pass" } });
  };

  const confirmNextRound = () => {
    // Effective call for each seat this round, in seat order.
    const callFor = (p: BiddingPosition): string =>
      p < myPosition
        ? (currentRound[p] ?? "Pass")
        : (nextRoundBids[p] ??
          (p === myPosition ? recommendedBid : undefined) ??
          "Pass");

    // Trailing passes carried over from the end of the previous round — they
    // count toward the 3-pass auction-ending streak.
    let consecutivePasses = 0;
    const prev = completedRounds[completedRounds.length - 1];
    if (prev) {
      for (let p = 4; p >= 1; p--) {
        if ((prev[p as BiddingPosition] ?? "Pass") === "Pass")
          consecutivePasses++;
        else break;
      }
    }
    // Has any real (suit/NT) bid happened yet?  3 consecutive passes only END
    // the auction once a contract is on the table — opening passes do not, so
    // a 4th seat can still open.  Without this guard, an auction that starts
    // Pass-Pass-Pass would wrongly drop the 4th seat's opening bid.
    const isRealCall = (b: string | undefined) =>
      !!b && b !== "Pass" && b !== "Double" && b !== "Redouble";
    let bidSeen = completedRounds.some((r) =>
      ([1, 2, 3, 4] as BiddingPosition[]).some((p) => isRealCall(r[p])),
    );

    // Store seats in order, stopping once 3 consecutive passes have ended the
    // auction — so a round that closes the bidding holds only the calls that
    // actually happened (not phantom Pass chips for seats that never acted).
    const completed: BidRound = {};
    for (let p = 1; p <= 4; p++) {
      if (bidSeen && consecutivePasses >= 3) break;
      const pos = p as BiddingPosition;
      const call = callFor(pos);
      completed[pos] = call;
      if (isRealCall(call)) bidSeen = true;
      consecutivePasses = call === "Pass" ? consecutivePasses + 1 : 0;
    }

    update({
      completedRounds: [...completedRounds, completed],
      currentRound: {},
    });
    setNextRoundBids({});
  };

  // ── Positions before and after me ────────────────────────────────────────────
  const positionsBefore: BiddingPosition[] = [];
  for (let p = 1; p < myPosition; p++)
    positionsBefore.push(p as BiddingPosition);

  const positionsAfter: BiddingPosition[] = [];
  for (let p = myPosition + 1; p <= 4; p++)
    positionsAfter.push(p as BiddingPosition);

  // ── Agreed suit detection (Blackwood / GSF) ───────────────────────────────────
  const myCompletedBids = completedRounds
    .map((r) => r[myPosition])
    .filter(Boolean);
  const needsAgreedSuit = myCompletedBids.some(
    (b) => b === "4NT" || b === "5NT",
  );

  // ── 3 consecutive passes detection ───────────────────────────────────────────
  const { isComplete, finalContract } = getFinalContractInfo(
    completedRounds,
    currentRound,
    myPosition,
  );

  // ── Last significant bid before my turn (for "My bid" options) ───────────────
  const lastBidBeforeNextRound = (() => {
    let last: string | undefined;
    for (const pos of positionsBefore) {
      const b = currentRound[pos];
      if (b && b !== "Pass") last = b;
    }
    if (last) return last;
    for (let i = completedRounds.length - 1; i >= 0; i--) {
      for (const pos of [4, 3, 2, 1] as BiddingPosition[]) {
        const b = completedRounds[i][pos];
        if (b && b !== "Pass") return b;
      }
    }
    return undefined;
  })();

  // ── Last suit/NT bid before my turn (floor for suit bids after Double/Redouble) ─
  const lastSuitBidBeforeNextRound = (() => {
    let last: string | undefined;
    for (const pos of positionsBefore) {
      const b = currentRound[pos];
      if (b && b !== "Pass" && b !== "Double" && b !== "Redouble") last = b;
    }
    if (last) return last;
    for (let i = completedRounds.length - 1; i >= 0; i--) {
      for (const pos of [4, 3, 2, 1] as BiddingPosition[]) {
        const b = completedRounds[i][pos];
        if (b && b !== "Pass" && b !== "Double" && b !== "Redouble") return b;
      }
    }
    return undefined;
  })();

  // ── "My bid" value and recommendation helper ──────────────────────────────────
  const myBidCurrent = nextRoundBids[myPosition] ?? recommendedBid ?? "Pass";
  const showUseRecommendation =
    !!recommendedBid &&
    nextRoundBids[myPosition] !== undefined &&
    nextRoundBids[myPosition] !== recommendedBid;

  // ── Visible slots in "Complete this round" ────────────────────────────────────
  // Round 1 (no completed rounds yet): all 4 positions always show.
  // Round 2+: show only enough slots to allow up to 3 consecutive passes
  // counting from the last non-pass bid anywhere in the auction (spanning the
  // tail of the previous round and the current round's slots in seat order).
  //
  // Slots: [...positionsBefore, myPosition, ...positionsAfter] in seat order.
  // A slot with a non-Pass default (recommendedBid for myPosition) counts as
  // a bid, resetting the consecutive-pass counter.
  const visibleAfterPositions = (() => {
    if (completedRounds.length === 0) return positionsAfter; // round 1: show all

    // Count trailing passes at the end of the most recent completed round.
    const lastRound = completedRounds[completedRounds.length - 1];
    let trailingPasses = 0;
    for (let p = 4; p >= 1; p--) {
      const b = lastRound[p as BiddingPosition] ?? "Pass";
      if (b === "Pass") trailingPasses++;
      else break;
    }

    // Walk through all current-round slots in seat order, maintaining the
    // running consecutive-pass count.  Stop adding visible slots once we've
    // reached 3 in a row.
    const allSlots: BiddingPosition[] = [
      ...positionsBefore,
      myPosition,
      ...positionsAfter,
    ];

    // Determine the effective bid for each slot:
    // - positionsBefore: currentRound value (already entered)
    // - myPosition: myBidCurrent (may be recommendedBid)
    // - positionsAfter: nextRoundBids value if set, else "Pass" (unknown = Pass)
    const slotBid = (pos: BiddingPosition): string => {
      if (pos < myPosition) return currentRound[pos] ?? "Pass";
      if (pos === myPosition) return myBidCurrent;
      return nextRoundBids[pos] ?? "Pass";
    };

    let consecutivePasses = trailingPasses;
    const visible = new Set<BiddingPosition>();

    for (const pos of allSlots) {
      if (consecutivePasses >= 3) break; // already at limit — don't add more
      const bid = slotBid(pos);
      if (pos >= myPosition) {
        // This is a slot in "Complete this round" — it should be visible
        visible.add(pos);
      }
      if (bid === "Pass") {
        consecutivePasses++;
      } else {
        consecutivePasses = 0;
      }
    }

    return positionsAfter.filter((p) => visible.has(p));
  })();

  // Whether "My bid" slot itself is visible.  It's always visible in round 1;
  // in later rounds it's visible as long as we haven't already hit 3 passes
  // from the tail of the previous round before reaching myPosition.
  const myBidVisible = (() => {
    if (completedRounds.length === 0) return true;
    const lastRound = completedRounds[completedRounds.length - 1];
    let trailingPasses = 0;
    for (let p = 4; p >= 1; p--) {
      const b = lastRound[p as BiddingPosition] ?? "Pass";
      if (b === "Pass") trailingPasses++;
      else break;
    }
    // Count passes from positionsBefore in this round
    let consecutivePasses = trailingPasses;
    for (const pos of positionsBefore) {
      const b = currentRound[pos] ?? "Pass";
      if (b === "Pass") consecutivePasses++;
      else consecutivePasses = 0;
    }
    return consecutivePasses < 3;
  })();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Auction Context
      </Typography>
      {/* ── My bidding position ────────────────────────────────────────── */}
      <Box
        sx={{
          mb: 2,
        }}
      >
        <Typography
          variant="caption"
          gutterBottom
          sx={{
            color: "text.secondary",
            display: "block",
          }}
        >
          My bidding position
        </Typography>
        {/* Seats grouped by partnership so it's clear who is on your side
            (you + partner) versus the opponents.  Each pair shows a ↔ link. */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {(
            [
              {
                side: "us" as Side,
                label: "You",
                seats: [myPosition, getRelatives(myPosition).partner].sort(
                  (a, b) => a - b,
                ) as BiddingPosition[],
              },
              {
                side: "them" as Side,
                label: "Opps",
                seats: [
                  getRelatives(myPosition).lho,
                  getRelatives(myPosition).rho,
                ].sort((a, b) => a - b) as BiddingPosition[],
              },
            ] as const
          ).map((group) => (
            <Box
              key={group.side}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                border: "1px solid",
                ...sideSx(group.side),
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", mr: 0.25 }}
              >
                {group.label}:
              </Typography>
              {group.seats.map((p) => (
                <Chip
                  key={p}
                  label={
                    myPosition === p
                      ? `${POSITION_LABELS[p]} (you)`
                      : POSITION_LABELS[p]
                  }
                  size="small"
                  clickable
                  variant={myPosition === p ? "filled" : "outlined"}
                  color={
                    group.side === "us"
                      ? "primary"
                      : myPosition === p
                        ? "primary"
                        : "default"
                  }
                  onClick={() =>
                    update({
                      myPosition: p,
                      currentRound: {},
                      completedRounds: [],
                    })
                  }
                  aria-label={`Position ${POSITION_LABELS[p]}`}
                />
              ))}
            </Box>
          ))}
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
      {/* ── Vulnerability (read-only from game state) ─────────────────── */}
      <Box
        sx={{
          mb: 2,
        }}
      >
        <Typography
          variant="caption"
          gutterBottom
          sx={{
            color: "text.secondary",
            display: "block",
          }}
        >
          Vulnerability
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label={`We: ${weVulnerable ? "Vulnerable" : "Not Vulnerable"}`}
            size="small"
            color={weVulnerable ? "warning" : "default"}
            variant={weVulnerable ? "filled" : "outlined"}
          />
          <Chip
            label={`They: ${theyVulnerable ? "Vulnerable" : "Not Vulnerable"}`}
            size="small"
            color={theyVulnerable ? "warning" : "default"}
            variant={theyVulnerable ? "filled" : "outlined"}
          />
        </Box>
      </Box>
      {/* ── Bidding complete banner ────────────────────────────────────── */}
      {isComplete && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Bidding complete
          {finalContract ? ` — Final contract: ${finalContract}` : ""}
        </Alert>
      )}
      {/* ── Completed rounds (prior bids) ─────────────────────────────── */}
      {completedRounds.length > 0 && (
        <Box
          sx={{
            mb: 2,
          }}
        >
          <Typography
            variant="caption"
            gutterBottom
            sx={{
              color: "text.secondary",
              display: "block",
            }}
          >
            Prior Rounds
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {completedRounds.map((round, idx) => (
              <CompletedRoundRow
                key={idx}
                round={round}
                roundIndex={idx}
                myPosition={myPosition}
                allCompletedRounds={completedRounds}
              />
            ))}
          </Box>
          <Divider sx={{ mt: 1, mb: 2 }} />
        </Box>
      )}
      {/* ── Current round: bids before my turn ────────────────────────── */}
      {!isComplete && (
        <Box
          sx={{
            mb: 2,
          }}
        >
          {myPosition === 1 ? (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontStyle: "italic",
              }}
            >
              You are the dealer — no prior bids this round.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {positionsBefore.map((pos, slotIdx) => {
                const rel = getRelationship(pos, myPosition);
                const priorSlots = positionsBefore.slice(0, slotIdx);
                const lastBid = lastSignificantBid(
                  completedRounds,
                  currentRound,
                  pos,
                  priorSlots,
                );
                const lastSuit = lastSuitBid(
                  completedRounds,
                  currentRound,
                  pos,
                  priorSlots,
                );
                const options = getValidBidsAfter(lastBid, lastSuit);
                const value = currentRound[pos] ?? "Pass";
                const slotLabel = getRelationshipLabel(pos, myPosition);

                return (
                  <BidSlot
                    key={pos}
                    slotLabel={slotLabel}
                    relationship={rel}
                    value={value}
                    options={options}
                    onChange={(val) => updateCurrentRound(pos, val)}
                    prevHighBid={lastBid}
                    bidderPreviousBid={lastRealBidBySeat(
                      completedRounds,
                      roundBefore(currentRound, pos),
                      pos,
                    )}
                    bidderPartnerPreviousBid={
                      lastActionBySeat(
                        completedRounds,
                        roundBefore(currentRound, pos),
                        getRelatives(pos).partner,
                      ) ?? "none"
                    }
                    auctionOpeningBid={auctionOpeningBidOf(
                      completedRounds,
                      currentRound,
                    )}
                  />
                );
              })}
            </Box>
          )}
        </Box>
      )}
      {/* ── Complete this round (hidden once auction is over) ────────── */}
      {!isComplete && (
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            p: 1.5,
            mb: 2,
          }}
        >
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 1.5 }}
          >
            {/* My bid */}
            {myBidVisible && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <BidSlot
                  slotLabel="My bid"
                  relationship="me"
                  value={myBidCurrent}
                  options={getValidBidsAfter(
                    lastBidBeforeNextRound,
                    lastSuitBidBeforeNextRound,
                  )}
                  onChange={(val) =>
                    setNextRoundBids((prev) => ({ ...prev, [myPosition]: val }))
                  }
                />
                {showUseRecommendation && (
                  <Chip
                    label={`↩ Use recommendation: ${recommendedBid}`}
                    size="small"
                    clickable
                    variant="outlined"
                    color="secondary"
                    aria-label={`Use recommendation: ${recommendedBid}`}
                    onClick={() =>
                      setNextRoundBids((prev) => ({
                        ...prev,
                        [myPosition]: recommendedBid!,
                      }))
                    }
                    sx={{ alignSelf: "flex-start" }}
                  />
                )}
              </Box>
            )}
            {/* Positions after me */}
            {visibleAfterPositions.map((pos) => {
              const afterIdx = positionsAfter.indexOf(pos);
              const prevBids = [
                myBidCurrent,
                ...positionsAfter
                  .slice(0, afterIdx)
                  .map((p) => nextRoundBids[p] ?? "Pass"),
              ];
              const lastSignificant = [...prevBids]
                .reverse()
                .find((b) => b !== "Pass");
              // `.find` returns undefined when every prior bid this round is a
              // Pass (e.g. my own bid is Pass) — fall back to the auction floor
              // BEFORE my turn so the dropdown is still capped at the highest
              // bid so far, not reset to "all bids".
              const effectiveLast = lastSignificant ?? lastBidBeforeNextRound;
              const lastSignificantSuit = [...prevBids]
                .reverse()
                .find(
                  (b) => b !== "Pass" && b !== "Double" && b !== "Redouble",
                );
              const effectiveLastSuit =
                lastSignificantSuit ?? lastSuitBidBeforeNextRound;
              const opts = getValidBidsAfter(effectiveLast, effectiveLastSuit);
              const val = nextRoundBids[pos] ?? "Pass";
              const rel = getRelationship(pos, myPosition);
              const label = getRelationshipLabel(pos, myPosition);
              // The in-progress round as seen from `pos`: the seats before me
              // (currentRound), then my bid, then the after-me seats that act
              // before `pos`.  Threading this lets a seat see partner's bid made
              // earlier in the same round (e.g. my bid, when partner = me-side).
              const roundSoFar: BidRound = {
                ...currentRound,
                [myPosition]: myBidCurrent,
              };
              for (const earlier of positionsAfter.slice(0, afterIdx)) {
                roundSoFar[earlier] = nextRoundBids[earlier] ?? "Pass";
              }
              const thisRoundBefore = roundBefore(roundSoFar, pos);
              return (
                <BidSlot
                  key={pos}
                  slotLabel={label}
                  relationship={rel}
                  value={val}
                  options={opts}
                  onChange={(v) =>
                    setNextRoundBids((prev) => ({ ...prev, [pos]: v }))
                  }
                  prevHighBid={effectiveLast}
                  bidderPreviousBid={lastRealBidBySeat(
                    completedRounds,
                    thisRoundBefore,
                    pos,
                  )}
                  bidderPartnerPreviousBid={
                    lastActionBySeat(
                      completedRounds,
                      thisRoundBefore,
                      getRelatives(pos).partner,
                    ) ?? "none"
                  }
                  auctionOpeningBid={auctionOpeningBidOf(
                    completedRounds,
                    roundSoFar,
                  )}
                />
              );
            })}
          </Box>
          <Button size="small" variant="contained" onClick={confirmNextRound}>
            Confirm Round
          </Button>
        </Box>
      )}
      {/* ── Agreed trump suit (Blackwood / GSF) ──────────────────────── */}
      {needsAgreedSuit && (
        <Box
          sx={{
            mb: 1.5,
          }}
        >
          <FormControl fullWidth size="small">
            <InputLabel id="agreed-suit-label">Agreed Trump Suit</InputLabel>
            <Select
              labelId="agreed-suit-label"
              label="Agreed Trump Suit"
              value={agreedSuit ?? "♠"}
              onChange={(e) => update({ agreedSuit: e.target.value })}
            >
              {AGREED_SUIT_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {colorSuits(s)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
    </Box>
  );
}
