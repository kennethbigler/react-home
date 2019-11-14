import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

interface TopScoresProps {
  finalTopSum: number;
  topSum: number;
  style: React.CSSProperties;
}

const TopScores: React.FC<TopScoresProps> = React.memo((props: TopScoresProps) => {
  const { topSum, finalTopSum, style } = props;

  return (
    <>
      <TableRow>
        <TableCell colSpan={2}>Total == 63</TableCell>
        <TableCell style={style}>{topSum}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Bonus if &gt;= 63</TableCell>
        <TableCell>Score 35</TableCell>
        <TableCell style={style}>{topSum >= 63 ? 35 : 0}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>Upper Half Total</TableCell>
        <TableCell style={style}>{finalTopSum}</TableCell>
      </TableRow>
      <TableRow />
    </>
  );
});

export default TopScores;
