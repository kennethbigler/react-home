import { memo } from "react";
import { TableCell, TableHead, TableRow } from "@mui/material";
import { centerCellSx } from "./styles";

const Header = memo(() => (
  <TableHead>
    <TableRow sx={{ borderBottom: 2 }}>
      <TableCell>Minimum Required for Bonus</TableCell>
      <TableCell>How to Score</TableCell>
      <TableCell sx={centerCellSx}>Game Score</TableCell>
    </TableRow>
  </TableHead>
));

Header.displayName = "Header";

export default Header;
