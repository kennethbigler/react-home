import * as React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

interface TopScoresProps {
  finalTopSum: number;
  topSum: number;
  style: React.CSSProperties;
}

const TopScores: React.FC<TopScoresProps> = React.memo(
  ({ topSum, finalTopSum, style }: TopScoresProps) => (
    <>
      <TableRow>
        <TableCell colSpan={2}>Total == 63</TableCell>
        <TableCell style={style}>{topSum}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Bonus if &gt;= 63</TableCell>
        <TableCell>Score 35</TableCell>
        <TableCell style={style}>{topSum % 100 >= 63 ? 35 : 0}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>Upper Half Total</TableCell>
        <TableCell style={style}>{finalTopSum}</TableCell>
      </TableRow>
      <TableRow />
    </>
  )
);

export default TopScores;
