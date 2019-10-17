import React from 'react';
import map from 'lodash/map';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Dice } from './types';

interface TableHeaderProps {
  roll: Dice;
  values: Dice[];
  saved: Dice[];
  handleUnsave: Function;
  handleSave: Function;
  handleDiceRoll: React.MouseEventHandler;
  getButtonText: Function;
}

const TableHeader: React.FC<TableHeaderProps> = (props: TableHeaderProps) => {
  const {
    values, saved, roll, handleUnsave,
    handleSave, handleDiceRoll, getButtonText,
  } = props;

  return (
    <div className="flex-container">
      <Typography variant="h4">{`Roll #${roll}/3`}</Typography>
      <div style={{ display: 'block', margin: 'auto', width: 320 }}>
        {map(saved, (val, i) => (
          <Button color="secondary" onClick={(): void => handleUnsave(i)} variant="outlined" key={i}>
            {val}
          </Button>
        ))}
        {map(values, (val, i) => (
          <Button color="primary" onClick={(): void => handleSave(i)} variant="outlined" key={i}>
            {val}
          </Button>
        ))}
      </div>
      <Button color="primary" onClick={handleDiceRoll} variant="contained">
        {getButtonText(roll)}
      </Button>
    </div>
  );
};

export default TableHeader;
