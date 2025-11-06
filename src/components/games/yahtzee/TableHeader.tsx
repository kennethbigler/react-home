import { MouseEventHandler, CSSProperties } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Dice } from "../../../jotai/yahtzee-state";

interface TableHeaderProps {
  roll: Dice;
  values: Dice[];
  saved: Dice[];
  handleUnsave: (i: number) => void;
  handleSave: (i: number) => void;
  handleDiceRoll: MouseEventHandler;
  getButtonText: (roll: Dice) => string;
}

const wrapperStyles: CSSProperties = {
  display: "block",
  margin: "auto",
  width: 320,
};

const TableHeader = ({
  values,
  saved,
  roll,
  handleUnsave,
  handleSave,
  handleDiceRoll,
  getButtonText,
}: TableHeaderProps) => (
  <div className="flex-container">
    <Typography variant="h4" component="h3">{`Roll #${roll}/3`}</Typography>
    <div style={wrapperStyles}>
      {saved.map((val, i) => (
        <Button
          key={i}
          variant="contained"
          onClick={(): void => handleUnsave(i)}
        >
          {val}
        </Button>
      ))}
      {values.map((val, i) => (
        <Button
          key={i}
          color="secondary"
          variant="outlined"
          onClick={(): void => handleSave(i)}
        >
          {val}
        </Button>
      ))}
    </div>
    <Button onClick={handleDiceRoll} variant="contained" disabled={roll === 3}>
      {getButtonText(roll)}
    </Button>
  </div>
);

export default TableHeader;
