import { ChangeEvent } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControlLabel,
  Switch,
  FormGroup,
  Typography,
  Grid,
  Divider,
} from "@mui/material";

export type eIn = ChangeEvent<HTMLInputElement>;

interface ScoreFormProps {
  contractSuit: string;
  contractTricks: number;
  declarerTricks: number;
  isWe: boolean;
  isDouble: boolean;
  isRedouble: boolean;
  is4Honours: boolean;
  is5Honours: boolean;
  is4Aces: boolean;
  winner: "we" | "they";
  madeBid: boolean;
  aboveTheLine: number;
  belowTheLine: number;
  onContractSuitChange: (e: SelectChangeEvent<string>) => void;
  onContractTricksChange: (e: SelectChangeEvent<number>) => void;
  onDeclarerTricksChange: (e: SelectChangeEvent<number>) => void;
  onBidWinnerToggle: (_e: eIn, checked: boolean) => void;
  onRedoubleToggle: (_e: eIn, checked: boolean) => void;
  onDoubleToggle: (_e: eIn, checked: boolean) => void;
  on4AcesToggle: (_e: eIn, checked: boolean) => void;
  on5HonoursToggle: (_e: eIn, checked: boolean) => void;
  on4HonoursToggle: (_e: eIn, checked: boolean) => void;
}

const CONTRACT_SUIT = "Contract Suit";
const CONTRACT_TRICKS = "Contract Tricks";
const DECLARER_TRICKS = "Declarer Team Tricks";

const bidOptions = [1, 2, 3, 4, 5, 6, 7];
const trickOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

const ScoreForm = ({
  contractSuit,
  contractTricks,
  declarerTricks,
  isWe,
  isDouble,
  isRedouble,
  is4Honours,
  is5Honours,
  is4Aces,
  winner,
  madeBid,
  aboveTheLine,
  belowTheLine,
  onContractSuitChange,
  onContractTricksChange,
  onDeclarerTricksChange,
  onBidWinnerToggle,
  onRedoubleToggle,
  onDoubleToggle,
  on4AcesToggle,
  on5HonoursToggle,
  on4HonoursToggle,
}: ScoreFormProps) => (
  <>
    <FormGroup>
      <Grid container spacing={1}>
        <Grid size={12}>
          <Typography variant="h6">Contract</Typography>
        </Grid>
        <Grid size={6}>
          <FormControl fullWidth>
            <InputLabel id="contract-suit-label">{CONTRACT_SUIT}</InputLabel>
            <Select
              labelId="contract-suit-label"
              id="contract-suit-select"
              value={contractSuit}
              label={CONTRACT_SUIT}
              name="contract-suit-name"
              onChange={onContractSuitChange}
            >
              <MenuItem value="nt">No Trump</MenuItem>
              <MenuItem value="major">Major ♥️♠️</MenuItem>
              <MenuItem value="minor">Minor ♣️♦️</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={6}>
          <FormControl fullWidth>
            <InputLabel id="contract-tricks-label">
              {CONTRACT_TRICKS}
            </InputLabel>
            <Select
              labelId="contract-tricks-label"
              id="contract-tricks-select"
              value={contractTricks}
              label={CONTRACT_TRICKS}
              name="contract-tricks-name"
              onChange={onContractTricksChange}
            >
              {bidOptions.map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={6}>
          <FormControlLabel
            control={
              <Switch
                checked={isDouble}
                onChange={onDoubleToggle}
                name="doubled"
              />
            }
            label="Doubled?"
          />
        </Grid>
        <Grid size={6}>
          <FormControlLabel
            control={
              <Switch
                checked={isRedouble}
                onChange={onRedoubleToggle}
                name="redoubled"
              />
            }
            label="Redoubled?"
          />
        </Grid>

        <Grid size={12}>
          <Typography>Who won the bid?</Typography>
        </Grid>
        <Grid size={4}>
          <FormControlLabel
            control={
              <Switch
                checked={isWe}
                onChange={onBidWinnerToggle}
                name="bid-winner"
                aria-label="Bid Winner is We"
              />
            }
            label={isWe ? "We" : "They"}
          />
        </Grid>
        <Grid size={8}>
          <FormControl fullWidth>
            <InputLabel id="declarer-tricks-label">
              {DECLARER_TRICKS}
            </InputLabel>
            <Select
              labelId="declarer-tricks-label"
              id="declarer-tricks-select"
              value={declarerTricks}
              label={DECLARER_TRICKS}
              name="declarer-tricks-name"
              onChange={onDeclarerTricksChange}
            >
              {trickOptions.map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={12}>
          <Typography variant="h6">Honours</Typography>
        </Grid>
        {contractSuit === "nt" ? (
          <Grid size={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={is4Aces}
                  onChange={on4AcesToggle}
                  name="4-aces"
                />
              }
              label="4 Aces in 1 hand?"
            />
          </Grid>
        ) : (
          <>
            <Grid size={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={is4Honours}
                    onChange={on4HonoursToggle}
                    name="4-honours"
                  />
                }
                label="4 Honours in 1 hand?"
              />
            </Grid>
            <Grid size={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={is5Honours}
                    onChange={on5HonoursToggle}
                    name="5-honours"
                  />
                }
                label="5 Honours in 1 hand?"
              />
            </Grid>
          </>
        )}
      </Grid>
    </FormGroup>

    <Divider />

    <div style={{ marginTop: 10 }}>
      <Typography variant="h6">Score</Typography>
      {madeBid ? (
        <Typography>Declarer ({winner}) won the hand!</Typography>
      ) : (
        <Typography>Defender ({winner}) successfully defended!</Typography>
      )}
      {madeBid && <Typography>Above the line: {aboveTheLine}</Typography>}
      <Typography>Below the line: {belowTheLine}</Typography>
    </div>
  </>
);

export default ScoreForm;
