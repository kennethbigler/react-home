import * as React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { AYTOHist } from "../histogram/useHist";
import getButtonValues from "./getButtonValues";

export interface AYTOTableRowProps {
  /** all gents */
  gents: string[];
  /** tracks odds */
  histLi: AYTOHist[];
  /** [lady-i: [gent-i: bool]] */
  noMatchLi: boolean[];
  // simple variables
  isTB: boolean;
  ladyName: string;
  lMatch: number;
  lPair: number;
  // functions
  onClick: (genti: number) => () => void;
}

const AYTOTableRow: React.FC<AYTOTableRowProps> = ({
  gents,
  histLi,
  lMatch,
  noMatchLi,
  isTB,
  lPair,
  ladyName: lName,
  onClick,
}) => (
  <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
    <TableCell component="th" scope="row">
      {lName}
    </TableCell>
    {gents.map((gName, gi) => {
      let histValue = 0;
      let histOdds = 0;
      if (histLi && histLi[gi]) {
        histValue = histLi[gi].rounds.length;
        histOdds = histLi[gi].odds;
      } else if (!noMatchLi[gi]) {
        const num = noMatchLi.reduce((s, nm) => (nm ? s : s + 1), 0);
        histOdds = Math.floor((1 / num) * 100);
      }
      const { variant, color } = getButtonValues(
        isTB,
        noMatchLi && noMatchLi[gi],
        lMatch === gi,
        lPair === gi,
        histValue,
      );

      // render
      return (
        <TableCell key={gName} sx={{ padding: 0, textAlign: "center" }}>
          <Button variant={variant} color={color} onClick={onClick(gi)}>
            {histOdds}%
          </Button>
        </TableCell>
      );
    })}
  </TableRow>
);

export default AYTOTableRow;
