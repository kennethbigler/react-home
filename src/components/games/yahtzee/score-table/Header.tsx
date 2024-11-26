import * as React from "react";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface HeaderProps {
  sx: React.CSSProperties;
}

const Header = React.memo(({ sx }: HeaderProps) => (
  <TableHead>
    <TableRow sx={{ borderBottom: 2 }}>
      <TableCell>Minimum Required for Bonus</TableCell>
      <TableCell>How to Score</TableCell>
      <TableCell sx={sx}>Game Score</TableCell>
    </TableRow>
  </TableHead>
));

Header.displayName = "Header";

export default Header;
