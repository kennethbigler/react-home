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
} from "@mui/material";
import ScoringTable from "./ScoringTable";

const ScoreDialog = () => {
  const [contractSuit, setContractSuit] = useState("nt");
  const [contractTricks, setContractTricks] = useState(1);
  const [isWe, setIsWe] = useState(true);
  const [declarerTricks, setDeclarerTricks] = useState(7);
  const [isDouble, setIsDouble] = useState(false);
  const [isRedouble, setIsRedouble] = useState(false);
  const [is4Honours, setIs4Honours] = useState(false);
  const [is5Honours, setIs5Honours] = useState(false);
  const [is4Aces, setIs4Aces] = useState(false);

  const handleContractSuitChange = (event: SelectChangeEvent<string>) =>
    setContractSuit(event.target.value);
  const handleContractTricksChange = (event: SelectChangeEvent<number>) =>
    setContractTricks(event.target.value);
  const handleBidWinnerToggle = (
    _e: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => setIsWe(checked);
  const handleDeclarerTricksChange = (event: SelectChangeEvent<number>) =>
    setDeclarerTricks(event.target.value);
  const handleDoubleToggle = (
    _e: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => setIsDouble(checked);
  const handleRedoubleToggle = (
    _e: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => setIsRedouble(checked);
  const handle4HonoursToggle = (
    _e: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => setIs4Honours(checked);
  const handle5HonoursToggle = (
    _e: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => setIs5Honours(checked);
  const handle4AcesToggle = (
    _e: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => setIs4Aces(checked);

  return (
    <div>
      <ul>
        <li>What was the contract suit? (Minors ♣️♦️, Majors ♥️♠️, NT)</li>
        <li>How many tricks are in the contract? (1-7)</li>

        <li>Who won the bid? (We/They)</li>
        <li>How many tricks did the declarer and dummy take? (0-13)</li>

        <li>Was there a double?</li>
        <li>Was there a redouble?</li>

        <li>if ♣️♦️♥️♠️, did 1 hand have 4 honours?</li>
        <li>if ♣️♦️♥️♠️, did 1 hand have 5 honours?</li>
        <li>if NT, did 1 hand have 4 aces?</li>
      </ul>

      <FormGroup>
        <FormControl fullWidth>
          <InputLabel id="contract-suit-label">
            What was the contract suit?
          </InputLabel>
          <Select
            labelId="contract-suit-label"
            id="contract-suit-select"
            value={contractSuit}
            label="What was the contract suit?"
            name="contract-suit-name"
            onChange={handleContractSuitChange}
          >
            <MenuItem value="nt">No Trump (NT)</MenuItem>
            <MenuItem value="major">Major ♥️♠️</MenuItem>
            <MenuItem value="minor">Minor ♣️♦️</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="contract-tricks-label">
            How many tricks are in the contract?
          </InputLabel>
          <Select
            labelId="contract-tricks-label"
            id="contract-tricks-select"
            value={contractTricks}
            label="How many tricks are in the contract?"
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

        <FormControl fullWidth>
          <InputLabel id="declarer-tricks-label">
            How many tricks did the declarer and dummy take?
          </InputLabel>
          <Select
            labelId="declarer-tricks-label"
            id="declarer-tricks-select"
            value={declarerTricks}
            label="How many tricks did the declarer and dummy take?"
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

        <Typography fontWeight="bold">Honours</Typography>

        {contractSuit === "nt" ? (
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
        ) : (
          <>
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
          </>
        )}
      </FormGroup>

      <ScoringTable />
    </div>
  );
};

export default ScoreDialog;
