import React from "react";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AYTOTableBody, { AYTOTableProps } from "./TableBody";

const AYTOTable = ({ gents, ...other }: AYTOTableProps) => (
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
      <AYTOTableBody gents={gents} {...other} />
    </Table>
  </TableContainer>
);

export default AYTOTable;
