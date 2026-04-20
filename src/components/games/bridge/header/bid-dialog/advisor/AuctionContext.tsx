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
import { useState } from "react";
import type { AuctionState, BidRound, BiddingPosition } from "./bidding-logic";
import {
  getBidMeaning,
  getFinalContractInfo,
  getRelatives,
  getValidBidsAfter,
} from "./bidding-logic";

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

// ─── Info icon with tooltip ────────────────────────────────────────────────────

interface BidInfoIconProps {
  bid: string;
  relationship: Relationship;
  prevHighBid?: string;
}

function BidInfoIcon({ bid, relationship, prevHighBid }: BidInfoIconProps) {
  const [open, setOpen] = useState(false);
  if (!bid) return null;
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Tooltip
        title={getBidMeaning(bid, relationship, prevHighBid)}
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
}

function BidSlot({
  slotLabel,
  relationship,
  value,
  options,
  onChange,
  prevHighBid,
}: BidSlotProps) {
  const currentValue = value || "Pass";
  const labelId = `bid-label-${slotLabel.replace(/[\s()]+/g, "-").toLowerCase()}`;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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
              {b}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {relationship !== "me" && (
        <BidInfoIcon
          bid={currentValue}
          relationship={relationship as Relationship}
          prevHighBid={prevHighBid}
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
}

function BidChip({ chipLabel, tooltipTitle, isMe }: BidChipProps) {
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
          label={chipLabel}
          size="small"
          variant={isMe ? "filled" : "outlined"}
          color={isMe ? "primary" : "default"}
          sx={{
            fontSize: "0.7rem",
            cursor: "pointer",
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
      {([1, 2, 3, 4] as BiddingPosition[]).map((pos) => {
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
        const tooltipTitle = getBidMeaning(
          bid,
          rel as Relationship,
          prevHighBid,
        );

        return (
          <BidChip
            key={pos}
            chipLabel={chipLabel}
            tooltipTitle={tooltipTitle}
            isMe={isMe}
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
    const completed: BidRound = {};
    for (let p = 1; p < myPosition; p++) {
      const pos = p as BiddingPosition;
      completed[pos] = currentRound[pos] ?? "Pass";
    }
    for (let p = myPosition; p <= 4; p++) {
      const pos = p as BiddingPosition;
      completed[pos] =
        nextRoundBids[pos] ??
        (p === myPosition ? recommendedBid : undefined) ??
        "Pass";
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
        <Box sx={{ display: "flex", gap: 1 }}>
          {([1, 2, 3, 4] as BiddingPosition[]).map((p) => (
            <Chip
              key={p}
              label={POSITION_LABELS[p]}
              size="small"
              clickable
              variant={myPosition === p ? "filled" : "outlined"}
              color={myPosition === p ? "primary" : "default"}
              onClick={() =>
                update({ myPosition: p, currentRound: {}, completedRounds: [] })
              }
              aria-label={`Position ${POSITION_LABELS[p]}`}
            />
          ))}
        </Box>
      </Box>
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
      <Divider sx={{ mb: 2 }} />
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
          <Typography
            variant="caption"
            gutterBottom
            sx={{
              color: "text.secondary",
              display: "block",
            }}
          >
            {myPosition === 1
              ? "Current round — you bid first"
              : "Current round — bids before my turn"}
          </Typography>
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
          <Typography
            variant="caption"
            gutterBottom
            sx={{
              color: "text.secondary",
              display: "block",
            }}
          >
            Complete this round
          </Typography>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 1.5 }}
          >
            {/* My bid */}
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
            {/* Positions after me */}
            {positionsAfter.map((pos, idx) => {
              const prevBids = [
                myBidCurrent,
                ...positionsAfter
                  .slice(0, idx)
                  .map((p) => nextRoundBids[p] ?? "Pass"),
              ];
              const lastSignificant = [...prevBids]
                .reverse()
                .find((b) => b !== "Pass");
              const effectiveLast =
                lastSignificant !== "Pass"
                  ? lastSignificant
                  : lastBidBeforeNextRound;
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
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
    </Box>
  );
}
