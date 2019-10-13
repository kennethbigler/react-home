import React, { memo, MouseEventHandler } from 'react';
import ContentAdd from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import red from '@material-ui/core/colors/red';
import lightGreen from '@material-ui/core/colors/lightGreen';

interface PieceProps {
  enabled: boolean;
  onClick: MouseEventHandler;
  piece: number;
}

const Piece: React.FC<PieceProps> = memo((props: PieceProps) => {
  const { piece, enabled, onClick } = props;

  let color;
  switch (piece) {
    case undefined:
      color = undefined;
      break;
    case 0:
      color = undefined;
      break;
    case 1:
      color = red[500];
      break;
    case 2:
      color = 'black';
      break;
    default:
      color = lightGreen[600];
      break;
  }

  const style: React.CSSProperties = { backgroundColor: color };

  return !enabled
    ? (
      <Fab disabled size="small" style={style}>
        <div />
      </Fab>
    ) : (
      <Fab size="small" onClick={onClick} style={style}>
        <ContentAdd style={{ color: 'white' }} />
      </Fab>
    );
});

export default Piece;
