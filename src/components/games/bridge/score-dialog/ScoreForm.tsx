import { useState, ChangeEvent } from "react";
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

type eIn = ChangeEvent<HTMLInputElement>;

const CONTRACT_SUIT = "Contract Suit";
const CONTRACT_TRICKS = "Contract Tricks";
const DECLARER_TRICKS = "Declarer Team Tricks";

const ScoreForm = () => {
  const [contractSuit, setContractSuit] = useState("nt");
  const [contractTricks, setContractTricks] = useState(1);
  const [isWe, setIsWe] = useState(true);
  const [declarerTricks, setDeclarerTricks] = useState(7);
  const [isDouble, setIsDouble] = useState(false);
  const [isRedouble, setIsRedouble] = useState(false);
  const [is4Honours, setIs4Honours] = useState(false);
  const [is5Honours, setIs5Honours] = useState(false);
  const [is4Aces, setIs4Aces] = useState(false);

  const handleContractSuitChange = (e: SelectChangeEvent<string>) =>
    setContractSuit(e.target.value);
  const handleContractTricksChange = (e: SelectChangeEvent<number>) =>
    setContractTricks(e.target.value);
  const handleBidWinnerToggle = (_e: eIn, checked: boolean) => setIsWe(checked);
  const handleDeclarerTricksChange = (e: SelectChangeEvent<number>) =>
    setDeclarerTricks(e.target.value);
  const handleDoubleToggle = (_e: eIn, checked: boolean) =>
    setIsDouble(checked);
  const handleRedoubleToggle = (_e: eIn, checked: boolean) =>
    setIsRedouble(checked);
  const handle4HonoursToggle = (_e: eIn, checked: boolean) =>
    setIs4Honours(checked);
  const handle5HonoursToggle = (_e: eIn, checked: boolean) =>
    setIs5Honours(checked);
  const handle4AcesToggle = (_e: eIn, checked: boolean) => setIs4Aces(checked);

  return (
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
              onChange={handleContractSuitChange}
            >
              <MenuItem value="nt">No Trump (NT)</MenuItem>
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
              onChange={handleContractTricksChange}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={6}>
          <FormControlLabel
            control={
              <Switch
                checked={isDouble}
                onChange={handleDoubleToggle}
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
                onChange={handleRedoubleToggle}
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
                onChange={handleBidWinnerToggle}
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
              onChange={handleDeclarerTricksChange}
            >
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={11}>11</MenuItem>
              <MenuItem value={12}>12</MenuItem>
              <MenuItem value={13}>13</MenuItem>
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
                  onChange={handle4AcesToggle}
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
                    onChange={handle4HonoursToggle}
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
                    onChange={handle5HonoursToggle}
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
  );
};

export default ScoreForm;
