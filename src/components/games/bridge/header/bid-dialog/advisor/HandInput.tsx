import {
  Box,
  Grid,
  InputAdornment,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { calcTP } from "./bidding-logic";
import type { Hand } from "./bidding-logic";

interface HandInputProps {
  hand: Hand;
  onChange: (hand: Hand) => void;
}

const SUIT_LABELS: {
  key: keyof Omit<Hand, "hcp">;
  label: string;
  symbol: string;
}[] = [
  { key: "spades", label: "Spades", symbol: "♠" },
  { key: "hearts", label: "Hearts", symbol: "♥" },
  { key: "clubs", label: "Clubs", symbol: "♣" },
  { key: "diamonds", label: "Diamonds", symbol: "♦" },
];

export default function HandInput({ hand, onChange }: HandInputProps) {
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

  const handleSuitChange = (key: keyof Omit<Hand, "hcp">, value: number) => {
    const clamped = Math.max(0, Math.min(13, value));
    onChange({ ...hand, [key]: clamped });
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
          Card Count per Suit (must total 13):
        </Typography>
        <Grid container spacing={2}>
          {SUIT_LABELS.map(({ key, label, symbol }) => (
            <Grid size={{ xs: 6, sm: 3 }} key={key}>
              <TextField
                label={`${symbol} ${label}`}
                type="number"
                value={hand[key]}
                inputProps={{ min: 0, max: 13, "aria-label": `${label} count` }}
                onChange={(e) =>
                  handleSuitChange(key, parseInt(e.target.value, 10) || 0)
                }
                error={!!cardCountError}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">{symbol}</InputAdornment>
                  ),
                }}
              />
            </Grid>
          ))}
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
