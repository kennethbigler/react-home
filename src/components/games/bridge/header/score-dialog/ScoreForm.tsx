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
  madeBid: boolean;
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

const suitOptions = ["♣️", "♦️", "♥️", "♠️", "NT"];
const bidOptions = [1, 2, 3, 4, 5, 6, 7];
const trickOptions = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  "7 (1)",
  "8 (2)",
  "9 (3)",
  "10 (4)",
  "11 (5)",
  "12 (6)",
  "13 (7)",
];

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
  madeBid,
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
            {suitOptions.map((suit) => (
              <MenuItem key={suit} value={suit}>
                {suit}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth>
          <InputLabel id="contract-tricks-label">{CONTRACT_TRICKS}</InputLabel>
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

      <Grid size={6}>
        <FormControl
          sx={{
            flexDirection: "row",
            alignItems: "center",
            margin: "10px 0",
          }}
        >
          <Typography>Bid: </Typography>
          <Switch
            checked={isWe}
            onChange={onBidWinnerToggle}
            name="bid-winner"
            slotProps={{ input: { "aria-label": "Bid Winner is we" } }}
          />
          <Typography>{isWe ? "We" : "They"}</Typography>
        </FormControl>
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth>
          <InputLabel id="declarer-tricks-label">{DECLARER_TRICKS}</InputLabel>
          <Select
            labelId="declarer-tricks-label"
            id="declarer-tricks-select"
            value={declarerTricks}
            label={DECLARER_TRICKS}
            name="declarer-tricks-name"
            onChange={onDeclarerTricksChange}
          >
            {trickOptions.map((n, i) => (
              <MenuItem key={n} value={i}>
                {n}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {madeBid && (
        <>
          <Grid size={12}>
            <Typography variant="h6">Honours</Typography>
          </Grid>
          {contractSuit === "NT" ? (
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
        </>
      )}
    </Grid>
  </FormGroup>
);

export default ScoreForm;
