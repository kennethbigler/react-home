import * as React from "react";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { RoundPairing } from "../../../../recoil/are-you-the-one-atom";
import TBDialog from "./TBDialog";
import { AYTOHist } from "../histogram/useHist";
import getButtonValues from "./getButtonValues";

export interface AYTOTableProps {
  gents: string[];
  hist: AYTOHist[][];
  ladies: string[];
  /** [lady-i: (gent-i | -1), -1, -1, ...] */
  matches: number[];
  /** [lady-i: [gent-i: bool]] */
  noMatch: boolean[][];
  options: string[];
  roundNumber: number;
  /** [round-i: RoundPairing] */
  roundPairings: RoundPairing[];
  updateMatch: (li: number, gi: number) => void;
  updateNoMatch: (li: number, gi: number) => void;
  updatePairs: (ri: number, li: number, gi: number) => void;
}

const AYTOTableBody: React.FC<AYTOTableProps> = ({
  gents,
  hist,
  ladies,
  matches,
  noMatch,
  options,
  roundNumber: ri,
  roundPairings,
  updateMatch,
  updateNoMatch,
  updatePairs,
}) => {
  const isTB = options.length === ri + 2;
  const isConsolidated = options.length === ri + 1;

  // state
  const [open, setOpen] = React.useState(false);
  const [tbi, setTBI] = React.useState([-1, -1]);

  // Handlers
  const handleClick = (roundi: number, ladyi: number, genti: number) => () => {
    if (isConsolidated) {
      return;
    }
    if (isTB) {
      setTBI([ladyi, genti]);
      setOpen(true);
      return;
    }
    // Regular Round, verify gent isn't already taken
    const tempLi = roundPairings[roundi]?.pairs.indexOf(genti);
    if (tempLi !== -1) {
      // deselect gent from old lady
      updatePairs(roundi, tempLi, -1);
    }
    // assign to new lady
    updatePairs(roundi, ladyi, genti);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleMatch = () => {
    const [li, gi] = tbi;
    updateMatch(li, gi);
    handleCancel();
  };

  const handleNoMatch = () => {
    const [li, gi] = tbi;
    updateNoMatch(li, gi);
    handleCancel();
  };

  return (
    <TableBody>
      {ladies.map((lName, li) => (
        <TableRow
          key={`ayto-table-row-${lName}`}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {lName}
          </TableCell>
          {gents.map((gName, gi) => {
            let histValue = 0;
            let histOdds = 0;
            if (hist[li] && hist[li][gi]) {
              histValue = hist[li][gi].rounds.length;
              histOdds = hist[li][gi].odds;
            } else if (!noMatch[li][gi]) {
              const num = noMatch.reduce((s, nm) => (nm[gi] ? s : s + 1), 0);
              histOdds = Math.floor((1 / num) * 100);
            }
            const { variant, color } = getButtonValues(
              isTB,
              noMatch[li] && noMatch[li][gi],
              matches[li] === gi,
              roundPairings[ri]?.pairs[li] === gi,
              isConsolidated,
              histValue,
            );

            // render
            return (
              <TableCell key={gName} sx={{ padding: 0, textAlign: "center" }}>
                <Button
                  variant={variant}
                  color={color}
                  onClick={handleClick(ri, li, gi)}
                >
                  {isConsolidated ? `${histOdds}%` : `${lName[0]}-${gName[0]}`}
                </Button>
              </TableCell>
            );
          })}
        </TableRow>
      ))}
      <TBDialog
        open={open}
        content={`${ladies[tbi[0]]} & ${gents[tbi[1]]}`}
        onCancel={handleCancel}
        onMatch={handleMatch}
        onNoMatch={handleNoMatch}
      />
    </TableBody>
  );
};

export default AYTOTableBody;
