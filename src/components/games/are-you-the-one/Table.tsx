import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { DBRootState } from "../../../store/types";
import { updatePairs } from "../../../store/modules/ayto";
import { options } from "../../../constants/ayto";

interface AYTOTableProps {
  ladies: string[];
  gents: string[];
  roundNumber: number;
}

const AYTOTable = (props: AYTOTableProps) => {
  const { ladies, gents, roundNumber: ri } = props;
  const isTB = options.length === ri + 1;

  // Redux
  const { roundPairings } = useSelector((state: DBRootState) => ({
    ...state.ayto,
  }));
  const dispatch = useDispatch();

  // Handlers
  const handleClick = (roundi: number, ladyi: number, genti: number) => () => {
    const tempLI = roundPairings[roundi]?.pairs.indexOf(genti);
    // TODO: if (isTB) -> need to populate different data structure
    // Regular Round
    if (tempLI !== -1) {
      // deselect gent from old lady
      dispatch(updatePairs(roundi, tempLI, -1));
    }
    // assign to new lady
    dispatch(updatePairs(roundi, ladyi, genti));
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="are you the one entry table">
        <TableHead>
          <TableRow>
            <TableCell />
            {gents.map((name) => (
              <TableCell
                key={name}
                sx={{ paddingLeft: 0, paddingRight: 0, textAlign: "center" }}
              >
                {name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {ladies.map((lName, li) => (
            <TableRow
              key={`ayto-table-row-${lName}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {lName}
              </TableCell>
              {gents.map((gName, gi) => (
                <TableCell key={gName} sx={{ padding: 0, textAlign: "center" }}>
                  {/* TODO: if isTB, need to load from a different data structure */}
                  <Button
                    variant={
                      roundPairings[ri]?.pairs[li] === gi
                        ? "contained"
                        : "outlined"
                    }
                    onClick={handleClick(ri, li, gi)}
                    color={
                      roundPairings[ri]?.pairs[li] === gi && isTB
                        ? "error"
                        : "primary"
                    }
                  >
                    {lName[0]}-{gName[0]}
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AYTOTable;
