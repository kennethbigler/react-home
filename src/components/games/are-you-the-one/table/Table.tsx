import React from "react";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AYTOTableBody from "./TableBody";

interface AYTOTableProps {
  ladies: string[];
  gents: string[];
  roundNumber: number;
}

const AYTOTable = (props: AYTOTableProps) => {
  const { ladies, gents, roundNumber } = props;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="are you the one data entry table">
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
        <AYTOTableBody
          roundNumber={roundNumber}
          ladies={ladies}
          gents={gents}
        />
      </Table>
    </TableContainer>
  );
};

export default AYTOTable;
