import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
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
  color: string;
}[] = [
  { key: "spades", label: "Spades", symbol: "♠", color: "#1565c0" },
  { key: "hearts", label: "Hearts", symbol: "♥", color: "#c62828" },
  { key: "clubs", label: "Clubs", symbol: "♣", color: "#2e7d32" },
  { key: "diamonds", label: "Diamonds", symbol: "♦", color: "#c62828" },
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
      <Box mb={3}>
        <Typography id="hcp-label" gutterBottom>
          High Card Points (HCP): <strong>{hand.hcp}</strong>
        </Typography>
        <Grid container spacing={2} alignItems="center">
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
              inputProps={{ min: 0, max: 37, "aria-label": "HCP value" }}
              onChange={(e) =>
                handleHcpChange(parseInt(e.target.value, 10) || 0)
              }
              size="small"
              sx={{ width: 80 }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Suit counts */}
      <Box mb={2}>
        <Typography gutterBottom>
          Card Count per Suit{" "}
          <Typography
            component="span"
            variant="body2"
            color={totalCards === 13 ? "success.main" : "error"}
            fontWeight="bold"
          >
            ({totalCards}/13)
          </Typography>
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {SUIT_LABELS.map(({ key, label, symbol, color }) => {
            const othersTotal = totalCards - (hand[key] as number);
            const maxForSuit = Math.min(
              13,
              13 - othersTotal + (hand[key] as number),
            );
            const suitLabelId = `suit-label-${key}`;
            return (
              <Box key={key}>
                <Typography id={suitLabelId} variant="body2" gutterBottom>
                  <span style={{ color }}>{symbol}</span> {label}:{" "}
                  <strong>{hand[key] as number}</strong>
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid size="grow">
                    <Slider
                      aria-labelledby={suitLabelId}
                      value={hand[key] as number}
                      min={0}
                      max={13}
                      marks={[
                        { value: 0 },
                        { value: 4 },
                        { value: 8 },
                        { value: 13 },
                      ]}
                      onChange={(_, v) => handleSuitChange(key, v as number)}
                      data-testid={`${key}-slider`}
                      sx={{
                        color,
                        "& .MuiSlider-thumb": { bgcolor: color },
                        "& .MuiSlider-track": { bgcolor: color },
                        "& .MuiSlider-rail": { opacity: 0.3 },
                      }}
                    />
                  </Grid>
                  <Grid size="auto">
                    <TextField
                      label={symbol}
                      type="number"
                      value={hand[key] as number}
                      inputProps={{
                        min: 0,
                        max: maxForSuit,
                        "aria-label": `${label} count`,
                      }}
                      onChange={(e) =>
                        handleSuitChange(key, parseInt(e.target.value, 10) || 0)
                      }
                      error={!!cardCountError}
                      size="small"
                      sx={{ width: 70 }}
                    />
                  </Grid>
                </Grid>
              </Box>
            );
          })}
        </Box>
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
          mb={2}
          sx={{
            border: "1px solid",
            borderColor: "info.main",
            borderRadius: 1,
            p: 1.5,
          }}
        >
          <Typography
            variant="caption"
            color="info.main"
            display="block"
            mb={1}
          >
            Partner bid 4NT (Blackwood) — how many aces do you hold?
          </Typography>
          <TextField
            label="Aces in hand (0-4)"
            type="number"
            value={hand.aces ?? ""}
            inputProps={{ min: 0, max: 4, "aria-label": "Aces count" }}
            onChange={(e) =>
              handleAcesChange(parseInt(e.target.value, 10) || 0)
            }
            size="small"
            sx={{ width: 160 }}
          />
        </Box>
      )}

      {/* Blackwood: Kings input (shown only when partner bids 5NT kings ask) */}
      {showKingsInput && (
        <Box
          mb={2}
          sx={{
            border: "1px solid",
            borderColor: "info.main",
            borderRadius: 1,
            p: 1.5,
          }}
        >
          <Typography
            variant="caption"
            color="info.main"
            display="block"
            mb={1}
          >
            Partner bid 5NT (kings ask) — how many kings do you hold?
          </Typography>
          <TextField
            label="Kings in hand (0-4)"
            type="number"
            value={hand.kings ?? ""}
            inputProps={{ min: 0, max: 4, "aria-label": "Kings count" }}
            onChange={(e) =>
              handleKingsChange(parseInt(e.target.value, 10) || 0)
            }
            size="small"
            sx={{ width: 160 }}
          />
        </Box>
      )}

      {/* Stopper question (shown when opponent has bid a suit) */}
      {showStopperInput && (
        <Box
          mb={2}
          sx={{
            border: "1px solid",
            borderColor: "warning.main",
            borderRadius: 1,
            p: 1.5,
          }}
        >
          <Typography
            variant="caption"
            color="warning.main"
            display="block"
            mb={0.5}
          >
            Opponent bid {opponentSuitLabel} — do you have a stopper in their
            suit?
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mb={1}
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
                inputProps={{ "aria-label": "Has stopper in opponent's suit" }}
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
