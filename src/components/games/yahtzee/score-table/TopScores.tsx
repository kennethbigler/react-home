import * as React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

interface TopScoresProps {
  finalTopSum: number;
  topSum: number;
  sx: React.CSSProperties;
}

const TopScores: React.FC<TopScoresProps> = React.memo(
  ({ topSum, finalTopSum, sx }: TopScoresProps) => (
    <>
      <TableRow sx={{ borderTop: 2 }}>
        <TableCell colSpan={2}>Total == 63</TableCell>
        <TableCell sx={sx}>{topSum}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Bonus if &gt;= 63</TableCell>
        <TableCell>Score 35</TableCell>
        <TableCell sx={sx}>{topSum % 100 >= 63 ? 35 : 0}</TableCell>
      </TableRow>
      <TableRow sx={{ borderBottom: 2 }}>
        <TableCell colSpan={2}>Upper Half Total</TableCell>
        <TableCell sx={sx}>{finalTopSum}</TableCell>
      </TableRow>
    </>
  ),
);

export default TopScores;
