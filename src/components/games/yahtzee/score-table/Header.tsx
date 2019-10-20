import React, { memo } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

interface HeaderProps {
  style: React.CSSProperties;
}

const Header: React.FC<HeaderProps> = memo((props: HeaderProps) => (
  <TableHead>
    <TableRow>
      <TableCell>Minimum Required for Bonus</TableCell>
      <TableCell>How to Score</TableCell>
      <TableCell style={props.style}>Game Score</TableCell>
    </TableRow>
  </TableHead>
));

export default Header;
