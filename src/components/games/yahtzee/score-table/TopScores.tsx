import { memo, CSSProperties } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

interface TopScoresProps {
  finalTopSum: number;
  topSum: number;
  sx: CSSProperties;
}

const TopScores = memo(({ topSum, finalTopSum, sx }: TopScoresProps) => (
  <>
    <TableRow sx={{ borderTop: 2 }}>
      <TableCell colSpan={2} component="th" scope="row">
        Total == 63
      </TableCell>
      <TableCell sx={sx}>{topSum}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell component="th" scope="row">
        Bonus if &gt;= 63
      </TableCell>
      <TableCell>Score 35</TableCell>
      <TableCell sx={sx}>{topSum % 100 >= 63 ? 35 : 0}</TableCell>
    </TableRow>
    <TableRow sx={{ borderBottom: 2 }}>
      <TableCell colSpan={2} component="th" scope="row">
        Upper Half Total
      </TableCell>
      <TableCell sx={sx}>{finalTopSum}</TableCell>
    </TableRow>
  </>
));

TopScores.displayName = "TopScores";

export default TopScores;
