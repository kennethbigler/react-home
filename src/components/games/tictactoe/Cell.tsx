import React from 'react';
import Button from '@material-ui/core/Button';
import { useTheme } from '@material-ui/core/styles';

interface CellProps {
  onClick: React.MouseEventHandler;
  value?: string;
  winner: boolean;
}

const Cell: React.FC<CellProps> = React.memo((props: CellProps) => {
  const { value, winner, onClick } = props;
  const { palette: { primary: { main }}} = useTheme();
  // add attributes if cell is a winner
  const attr: React.CSSProperties = winner ? { color: 'white', backgroundColor: main } : {};

  return (
    <Button onClick={onClick} style={attr} role="button">
      {value || <br />}
    </Button>
  );
});

export default Cell;
