import { useState } from "react";
import { RoundPairing } from "../../../../jotai/are-you-the-one-state";
import TBDialog from "./TBDialog";
import { AYTOHist } from "../histogram/useHist";
import AYTOTableRow from "./TableRow";
import { TableBody } from "@mui/material";

export interface AYTOTableProps {
  /** gents names */
  gents: string[];
  /** [lady-i: [gent-i: { odds, rounds together }]] */
  hist: AYTOHist[][];
  /** ladies names */
  ladies: string[];
  /** [lady-i: (gent-i | -1), -1, -1, ...] */
  matches: number[];
  /** [lady-i: [gent-i: bool]] */
  noMatch: boolean[][];
  /** round options, last is Truth Booth (TB) */
  options: string[];
  ri: number;
  /** [round-i: RoundPairing] */
  roundPairings: RoundPairing[];
  updateMatch: (li: number, gi: number) => void;
  updateNoMatch: (li: number, gi: number) => void;
  updatePairs: (ri: number, li: number, gi: number) => void;
}

const AYTOTableBody = ({
  gents,
  hist,
  ladies,
  matches,
  noMatch,
  options,
  ri,
  roundPairings,
  updateMatch,
  updateNoMatch,
  updatePairs,
}: AYTOTableProps) => {
  const isTB = options.length === ri + 1;

  // state
  const [open, setOpen] = useState(false);
  const [tbi, setTBI] = useState([-1, -1]);

  // Handlers
  const handleClick =
    (roundi: number, ladyi: number) => (genti: number) => () => {
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
        <AYTOTableRow
          key={`ayto-table-row-${lName}`}
          gents={gents}
          histLi={hist[li]}
          noMatchLi={noMatch[li]}
          isTB={isTB}
          ladyName={lName}
          lMatch={matches[li]}
          lPair={roundPairings[ri]?.pairs[li]}
          onClick={handleClick(ri, li)}
        />
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
