import { memo } from "react";
import { TableCell, TableRow } from "@mui/material";
import { centerCellSx } from "./styles";

interface TopScoresProps {
  finalTopSum: number;
  topSum: number;
}

const TopScores = memo(({ topSum, finalTopSum }: TopScoresProps) => (
  <>
    <TableRow sx={{ borderTop: 2 }}>
      <TableCell colSpan={2} component="th" scope="row">
        Total == 63
      </TableCell>
      <TableCell sx={centerCellSx}>{topSum}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell component="th" scope="row">
        Bonus if &gt;= 63
      </TableCell>
      <TableCell>Score 35</TableCell>
      <TableCell sx={centerCellSx}>{topSum % 100 >= 63 ? 35 : 0}</TableCell>
    </TableRow>
    <TableRow sx={{ borderBottom: 2 }}>
      <TableCell colSpan={2} component="th" scope="row">
        Upper Half Total
      </TableCell>
      <TableCell sx={centerCellSx}>{finalTopSum}</TableCell>
    </TableRow>
  </>
));

TopScores.displayName = "TopScores";

export default TopScores;
