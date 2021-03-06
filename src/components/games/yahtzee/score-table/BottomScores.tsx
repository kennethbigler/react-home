import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

interface BottomScoresProps {
  bottomSum: number;
  finalTopSum: number;
  style: React.CSSProperties;
}

const BottomScores: React.FC<BottomScoresProps> = React.memo(({ finalTopSum, bottomSum, style }: BottomScoresProps) => (
  <>
    <TableRow>
      <TableCell colSpan={2}>Lower Half Total</TableCell>
      <TableCell style={style}>{bottomSum}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell colSpan={2}>Upper Half Total</TableCell>
      <TableCell style={style}>{finalTopSum}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell colSpan={2}>Grand Total</TableCell>
      <TableCell style={style}>{finalTopSum + bottomSum}</TableCell>
    </TableRow>
  </>
));

export default BottomScores;
