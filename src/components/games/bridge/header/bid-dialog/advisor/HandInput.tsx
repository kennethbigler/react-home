import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { calcTP } from "./bidding-logic";
import type { Hand } from "./bidding-logic";

interface HandInputProps {
  hand: Hand;
  onChange: (hand: Hand) => void;
  /** Show the optional "Aces in hand" field — appears when partner bids 4NT (Blackwood). */
  showAcesInput?: boolean;
  /** Show the optional "Kings in hand" field — appears when partner bids 5NT (kings ask). */
  showKingsInput?: boolean;
  /**
   * Show the stopper question — appears when the opponent has bid a suit.
   * Pass the opponent's suit name (e.g. "spades") so we can label it correctly.
   */
  showStopperInput?: boolean;
  opponentSuitLabel?: string;
}

const SUIT_LABELS: {
  key: keyof Omit<Hand, "hcp" | "aces" | "kings">;
  label: string;
  symbol: string;
}[] = [
  { key: "spades", label: "Spades", symbol: "♠" },
  { key: "hearts", label: "Hearts", symbol: "♥" },
  { key: "clubs", label: "Clubs", symbol: "♣" },
  { key: "diamonds", label: "Diamonds", symbol: "♦" },
];

export default function HandInput({
  hand,
  onChange,
  showAcesInput = false,
  showKingsInput = false,
  showStopperInput = false,
  opponentSuitLabel = "the opponent's suit",
}: HandInputProps) {
  const totalCards = hand.spades + hand.hearts + hand.diamonds + hand.clubs;
  const cardCountError =
    totalCards !== 13
      ? `Card counts must total 13 (currently ${totalCards})`
      : "";
  const tp = calcTP(hand);

  const handleHcpChange = (value: number) => {
    const clamped = Math.max(0, Math.min(37, value));
    onChange({ ...hand, hcp: clamped });
  };

  const handleSuitChange = (
    key: keyof Omit<Hand, "hcp" | "aces" | "kings">,
    value: number,
  ) => {
    const clamped = Math.max(0, Math.min(13, value));
    onChange({ ...hand, [key]: clamped });
  };

  const handleAcesChange = (value: number) => {
    const clamped = Math.max(0, Math.min(4, value));
    onChange({ ...hand, aces: clamped });
  };

  const handleKingsChange = (value: number) => {
    const clamped = Math.max(0, Math.min(4, value));
    onChange({ ...hand, kings: clamped });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        My Hand
      </Typography>
      {/* HCP input */}
      <Box
        sx={{
          mb: 3,
        }}
      >
        <Typography id="hcp-label" gutterBottom>
          High Card Points (HCP): <strong>{hand.hcp}</strong>
        </Typography>
        <Grid
          container
          spacing={2}
          sx={{
            alignItems: "center",
          }}
        >
          <Grid size="grow">
            <Slider
              aria-labelledby="hcp-label"
              value={hand.hcp}
              min={0}
              max={37}
              marks={[
                { value: 0 },
                { value: 10 },
                { value: 20 },
                { value: 37 },
              ]}
              onChange={(_, v) => handleHcpChange(v as number)}
              data-testid="hcp-slider"
            />
          </Grid>
          <Grid size="auto">
            <TextField
              label="HCP"
              type="number"
              value={hand.hcp}
              onChange={(e) =>
                handleHcpChange(parseInt(e.target.value, 10) || 0)
              }
              size="small"
              sx={{ width: 80 }}
              slotProps={{
                htmlInput: { min: 0, max: 37, "aria-label": "HCP value" },
              }}
            />
          </Grid>
        </Grid>
      </Box>
      {/* Suit counts */}
      <Box
        sx={{
          mb: 2,
        }}
      >
        <Typography gutterBottom>
          Card Count per Suit{" "}
          <Typography
            component="span"
            variant="body2"
            color={totalCards === 13 ? "success.main" : "error"}
            sx={{
              fontWeight: "bold",
            }}
          >
            ({totalCards}/13)
          </Typography>
        </Typography>
        <Grid container>
          {SUIT_LABELS.map(({ key, label, symbol }, index) => {
            const current = hand[key] as number;
            const othersTotal = totalCards - current;
            const maxForSuit = Math.min(13, 13 - othersTotal + current);
            return (
              <Grid
                key={key}
                size={{ xs: 6, sm: 3 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 0.5,
                  borderLeft: {
                    xs: index % 2 !== 0 ? "1px solid" : "none",
                    sm: index > 0 ? "1px solid" : "none",
                  },
                  borderTop: {
                    xs: index >= 2 ? "1px solid" : "none",
                    sm: "none",
                  },
                  borderColor: "divider",
                }}
              >
                <IconButton
                  size="small"
                  aria-label={`Decrease ${label}`}
                  onClick={() => handleSuitChange(key, current - 1)}
                  disabled={current <= 0}
                >
                  <RemoveIcon fontSize="inherit" />
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: 28,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                  aria-label={`${label} count`}
                >
                  {current}
                  {symbol}
                </Typography>
                <IconButton
                  size="small"
                  aria-label={`Increase ${label}`}
                  onClick={() => handleSuitChange(key, current + 1)}
                  disabled={current >= maxForSuit}
                >
                  <AddIcon fontSize="inherit" />
                </IconButton>
              </Grid>
            );
          })}
        </Grid>
        {cardCountError && (
          <Typography
            color="error"
            variant="caption"
            role="alert"
            sx={{ mt: 0.5, display: "block" }}
          >
            {cardCountError}
          </Typography>
        )}
      </Box>
      {/* Blackwood: Aces input (shown only when partner bids 4NT) */}
      {showAcesInput && (
        <Box
          sx={{
            mb: 2,
            border: "1px solid",
            borderColor: "info.main",
            borderRadius: 1,
            p: 1.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "info.main",
              display: "block",
              mb: 1,
            }}
          >
            Partner bid 4NT (Blackwood) — how many aces do you hold?
          </Typography>
          <TextField
            label="Aces in hand (0-4)"
            type="number"
            value={hand.aces ?? ""}
            onChange={(e) =>
              handleAcesChange(parseInt(e.target.value, 10) || 0)
            }
            size="small"
            sx={{ width: 160 }}
            slotProps={{
              htmlInput: { min: 0, max: 4, "aria-label": "Aces count" },
            }}
          />
        </Box>
      )}
      {/* Blackwood: Kings input (shown only when partner bids 5NT kings ask) */}
      {showKingsInput && (
        <Box
          sx={{
            mb: 2,
            border: "1px solid",
            borderColor: "info.main",
            borderRadius: 1,
            p: 1.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "info.main",
              display: "block",
              mb: 1,
            }}
          >
            Partner bid 5NT (kings ask) — how many kings do you hold?
          </Typography>
          <TextField
            label="Kings in hand (0-4)"
            type="number"
            value={hand.kings ?? ""}
            onChange={(e) =>
              handleKingsChange(parseInt(e.target.value, 10) || 0)
            }
            size="small"
            sx={{ width: 160 }}
            slotProps={{
              htmlInput: { min: 0, max: 4, "aria-label": "Kings count" },
            }}
          />
        </Box>
      )}
      {/* Stopper question (shown when opponent has bid a suit) */}
      {showStopperInput && (
        <Box
          sx={{
            mb: 2,
            border: "1px solid",
            borderColor: "warning.main",
            borderRadius: 1,
            p: 1.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "warning.main",
              display: "block",
              mb: 0.5,
            }}
          >
            Opponent bid {opponentSuitLabel} — do you have a stopper in their
            suit?
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              display: "block",
              mb: 1,
            }}
          >
            A <strong>stopper</strong> is a card (or cards) that can win a trick
            in the opponent&apos;s suit: <strong>Ace</strong> (always stops it),{" "}
            <strong>King + one other card</strong> (Kx),{" "}
            <strong>Queen + two others</strong> (Qxx), or{" "}
            <strong>Jack + three others</strong> (Jxxx). Without a stopper, the
            opponents can run that suit against a NT contract.
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={hand.hasStopperInOpponentSuit ?? false}
                indeterminate={hand.hasStopperInOpponentSuit === undefined}
                onChange={(e) =>
                  onChange({
                    ...hand,
                    hasStopperInOpponentSuit: e.target.checked,
                  })
                }
                slotProps={{
                  input: { "aria-label": "Has stopper in opponent's suit" },
                }}
              />
            }
            label={
              hand.hasStopperInOpponentSuit === undefined
                ? "Unknown — please check your hand"
                : hand.hasStopperInOpponentSuit
                  ? "Yes, I have a stopper"
                  : "No stopper in their suit"
            }
          />
        </Box>
      )}
      {/* TP display */}
      <Box
        sx={{
          bgcolor: "action.hover",
          borderRadius: 1,
          px: 2,
          py: 1,
          display: "flex",
          gap: 3,
        }}
      >
        <Typography variant="body2">
          <strong>HCP:</strong> {hand.hcp}
        </Typography>
        <Typography variant="body2">
          <strong>Total Points (TP):</strong> {tp}
        </Typography>
        <Typography
          variant="body2"
          color={totalCards === 13 ? "success.main" : "error"}
        >
          <strong>Cards:</strong> {totalCards}/13
        </Typography>
      </Box>
    </Box>
  );
}
