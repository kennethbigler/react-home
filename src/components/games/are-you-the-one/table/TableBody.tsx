import * as React from "react";
import TableBody from "@mui/material/TableBody";
import { RoundPairing } from "../../../../recoil/are-you-the-one-atom";
import TBDialog from "./TBDialog";
import { AYTOHist } from "../histogram/useHist";
import AYTOTableRow from "./TableRow";

export interface AYTOTableProps {
  /** gents names */
  gents: string[];
  /** tracks odds */
  hist: AYTOHist[][];
  /** ladies names */
  ladies: string[];
  /** [lady-i: (gent-i | -1), -1, -1, ...] */
  matches: number[];
  /** [lady-i: [gent-i: bool]] */
  noMatch: boolean[][];
  /** round options, last is Truth Booth (TB) */
  options: string[];
  /** frequently referred to as ri */
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
  const isTB = options.length === ri + 1;

  // state
  const [open, setOpen] = React.useState(false);
  const [tbi, setTBI] = React.useState([-1, -1]);

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
