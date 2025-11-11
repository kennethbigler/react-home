import {
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Typography,
} from "@mui/material";
import { memo } from "react";

const ScoringTable = memo(() => {
  return (
    <Table aria-label="Bridge scoring table">
      <TableHead>
        <TableRow>
          <TableCell colSpan={2} align="center">
            <Typography variant="h6">Scoring Table</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableHead>
        <TableRow>
          <TableCell colSpan={2} align="center">
            Contracts - Trick Values
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>No Trump 🥇</TableCell>
          <TableCell>40</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>No Trump 🥈+</TableCell>
          <TableCell>30</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Majors ♥️♠️</TableCell>
          <TableCell>30</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Minors ♣️♦️</TableCell>
          <TableCell>20</TableCell>
        </TableRow>
      </TableBody>

      <TableHead>
        <TableRow>
          <TableCell colSpan={2} align="center">
            Rubbers
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>2 Game Rubber Won</TableCell>
          <TableCell>700</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>3 Game Rubber Won</TableCell>
          <TableCell>500</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={2}>Unfinished Rubbers</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Won the only game</TableCell>
          <TableCell>300</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Only part score in an unfinished game</TableCell>
          <TableCell>100</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
});

ScoringTable.displayName = "ScoringTable";

export default ScoringTable;
