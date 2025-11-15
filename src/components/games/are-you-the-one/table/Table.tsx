import AYTOTableBody, { AYTOTableProps } from "./TableBody";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const AYTOTable = ({ gents, ...other }: AYTOTableProps) => (
  <TableContainer component={Paper}>
    <Table aria-label="are you the one data entry table">
      <TableHead>
        <TableRow>
          <TableCell>-</TableCell>
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
