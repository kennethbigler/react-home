import { memo, CSSProperties } from "react";
import { TableCell, TableHead, TableRow } from "@mui/material";
interface HeaderProps {
  sx: CSSProperties;
}

const Header = memo(({ sx }: HeaderProps) => (
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
