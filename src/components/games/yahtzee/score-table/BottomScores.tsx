import { memo } from "react";
import { TableCell, TableRow } from "@mui/material";
import { centerCellSx } from "./styles";

interface BottomScoresProps {
  bottomSum: number;
  finalTopSum: number;
}

const BottomScores = memo(({ finalTopSum, bottomSum }: BottomScoresProps) => (
  <>
    <TableRow sx={{ borderTop: 2 }}>
      <TableCell colSpan={2} component="th" scope="row">
        Lower Half Total
      </TableCell>
      <TableCell sx={centerCellSx}>{bottomSum}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell colSpan={2} component="th" scope="row">
        Upper Half Total
      </TableCell>
      <TableCell sx={centerCellSx}>{finalTopSum}</TableCell>
    </TableRow>
    <TableRow sx={{ borderBottom: 2 }}>
      <TableCell colSpan={2} component="th" scope="row">
        Grand Total
      </TableCell>
      <TableCell sx={centerCellSx}>{finalTopSum + bottomSum}</TableCell>
    </TableRow>
  </>
));

BottomScores.displayName = "BottomScores";

export default BottomScores;
