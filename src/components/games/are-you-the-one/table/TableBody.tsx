import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";
import { DBRootState } from "../../../../store/types";
import { updatePairs, updateNoMatch } from "../../../../store/modules/ayto";
import { options } from "../../../../constants/ayto";

interface AYTOTableProps {
  ladies: string[];
  gents: string[];
  roundNumber: number;
}

const AYTOTableBody = (props: AYTOTableProps) => {
  const { ladies, gents, roundNumber: ri } = props;
  const isTB = options.length === ri + 1;

  // Redux
  const { roundPairings, matches, noMatch } = useSelector(
    (state: DBRootState) => ({ ...state.ayto })
  );
  const dispatch = useDispatch();

  // Handlers
  const handleClick = (roundi: number, ladyi: number, genti: number) => () => {
    if (isTB) {
      // popup modal. Match ? updateMatch : updateNoMatch
      dispatch(updateNoMatch(ladyi, genti));
      return;
    }
    // Regular Round, verify gent isn't already taken
    const tempLI = roundPairings[roundi]?.pairs.indexOf(genti);
    if (tempLI !== -1) {
      // deselect gent from old lady
      dispatch(updatePairs(roundi, tempLI, -1));
    }
    // assign to new lady
    dispatch(updatePairs(roundi, ladyi, genti));
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
            let variant: "outlined" | "contained" = "outlined";
            let color: "primary" | "error" = "primary";
            let disabled = false;

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

            return (
              <TableCell key={gName} sx={{ padding: 0, textAlign: "center" }}>
                <Button
                  variant={variant}
                  color={color}
                  onClick={handleClick(ri, li, gi)}
                  disabled={disabled}
                >
                  {lName[0]}-{gName[0]}
                </Button>
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
};

export default AYTOTableBody;
