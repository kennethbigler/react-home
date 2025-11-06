import { memo, CSSProperties } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

interface BottomScoresProps {
  bottomSum: number;
  finalTopSum: number;
  sx: CSSProperties;
}

const BottomScores = memo(
  ({ finalTopSum, bottomSum, sx }: BottomScoresProps) => (
    <>
      <TableRow sx={{ borderTop: 2 }}>
        <TableCell colSpan={2} component="th" scope="row">
          Lower Half Total
        </TableCell>
        <TableCell sx={sx}>{bottomSum}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2} component="th" scope="row">
          Upper Half Total
        </TableCell>
        <TableCell sx={sx}>{finalTopSum}</TableCell>
      </TableRow>
      <TableRow sx={{ borderBottom: 2 }}>
        <TableCell colSpan={2} component="th" scope="row">
          Grand Total
        </TableCell>
        <TableCell sx={sx}>{finalTopSum + bottomSum}</TableCell>
      </TableRow>
    </>
  ),
);

BottomScores.displayName = "BottomScores";

export default BottomScores;
