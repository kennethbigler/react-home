import React, { memo } from 'react';
import Button from '@material-ui/core/Button';
import indigo from '@material-ui/core/colors/indigo';

interface CellProps {
  onClick: React.MouseEventHandler;
  value?: string;
  winner: boolean;
}

const Cell: React.FC<CellProps> = memo((props: CellProps) => {
  const { value, winner, onClick } = props;
  // add attributes if cell is a winner
  const attr: React.CSSProperties = winner ? { color: 'white', backgroundColor: indigo.A700 } : {};

  return (
    <Button onClick={onClick} style={attr}>
      {value || <br />}
    </Button>
  );
});

export default Cell;
