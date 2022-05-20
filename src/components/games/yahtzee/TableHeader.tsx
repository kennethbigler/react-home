import React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Dice } from "../../../store/modules/yahtzee";

interface TableHeaderProps {
  roll: Dice;
  values: Dice[];
  saved: Dice[];
  handleUnsave: (i: number) => void;
  handleSave: (i: number) => void;
  handleDiceRoll: React.MouseEventHandler;
  getButtonText: (roll: Dice) => string;
}

const wrapperStyles: React.CSSProperties = {
  display: "block",
  margin: "auto",
  width: 320,
};

const TableHeader: React.FC<TableHeaderProps> = (props: TableHeaderProps) => {
  const {
    values,
    saved,
    roll,
    handleUnsave,
    handleSave,
    handleDiceRoll,
    getButtonText,
  } = props;

  return (
    <div className="flex-container">
      <Typography variant="h4">{`Roll #${roll}/3`}</Typography>
      <div style={wrapperStyles}>
        {saved.map((val, i) => (
          <Button
            color="secondary"
            onClick={(): void => handleUnsave(i)}
            variant="outlined"
            key={i}
          >
            {val}
          </Button>
        ))}
        {values.map((val, i) => (
          <Button
            color="primary"
            onClick={(): void => handleSave(i)}
            variant="outlined"
            key={i}
          >
            {val}
          </Button>
        ))}
      </div>
      <Button
        color="primary"
        onClick={handleDiceRoll}
        variant="contained"
        disabled={roll === 3}
      >
        {getButtonText(roll)}
      </Button>
    </div>
  );
};

export default TableHeader;
