import * as React from "react";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface HeaderProps {
  style: React.CSSProperties;
}

const Header: React.FC<HeaderProps> = React.memo((props: HeaderProps) => (
  <TableHead>
    <TableRow>
      <TableCell>Minimum Required for Bonus</TableCell>
      <TableCell>How to Score</TableCell>
      <TableCell style={props.style}>Game Score</TableCell>
    </TableRow>
  </TableHead>
));

export default Header;
