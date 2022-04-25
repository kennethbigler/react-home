import React from "react";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";
import { RoundPairing } from "../../../../store/types";
import TBDialog from "./TBDialog";

export interface AYTOTableProps {
  gents: string[];
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

const AYTOTableBody = (props: AYTOTableProps) => {
  const {
    gents,
    ladies,
    matches,
    noMatch,
    options,
    roundNumber: ri,
    roundPairings,
    updateMatch,
    updateNoMatch,
    updatePairs,
  } = props;
  const isTB = options.length === ri + 2;
  const isConsolidated = options.length === ri + 1;

  // state
  const [open, setOpen] = React.useState(false);
  const [tbi, setTBI] = React.useState([-1, -1]);
  const hist: number[][] = [];

  // create histogram
  roundPairings.forEach((RP) => {
    RP.pairs.forEach((gi, li) => {
      !hist[li] && (hist[li] = []);
      hist[li][gi] = !hist[li][gi] ? 1 : hist[li][gi] + 1;
    });
  });

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
    const tempLI = roundPairings[roundi]?.pairs.indexOf(genti);
    if (tempLI !== -1) {
      // deselect gent from old lady
      updatePairs(roundi, tempLI, -1);
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
            // variables
            let variant: "outlined" | "contained" = "outlined";
            let color: "primary" | "error" | "success" = "primary";
            let disabled = false;

            // logic
            if (isTB) {
              color = "error";
              // if noMatch
              if (noMatch[li] && noMatch[li][gi]) {
                variant = "contained";
              }
            } else {
              // if paired this round
              if (roundPairings[ri]?.pairs[li] === gi) {
                variant = "contained";
              }
              // if no match
              if (noMatch[li] && noMatch[li][gi]) {
                variant = "contained";
                disabled = true;
              }
            }
            // if match
            if (matches[li] === gi) {
              variant = "contained";
              color = "success";
            }

            const histValue = hist[li] ? hist[li][gi] || 0 : 0;
            // if consolidated
            if (isConsolidated && histValue > 0) {
              variant = "contained";
            }

            // render
            return (
              <TableCell key={gName} sx={{ padding: 0, textAlign: "center" }}>
                <Button
                  variant={variant}
                  color={color}
                  onClick={handleClick(ri, li, gi)}
                  disabled={disabled}
                >
                  {isConsolidated ? histValue : `${lName[0]}-${gName[0]}`}
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
