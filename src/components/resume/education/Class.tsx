import React from 'react';
import { Typography } from '@material-ui/core';

export interface ClassProps {
  name: string;
  catalog?: string;
}

/** Education  ->  Degree  -> Year  ->  Quarter  ->  Class */
const Class: React.FC<ClassProps> = React.memo(({ name, catalog }: ClassProps) => (
  <Typography>
    <li>
      {catalog && <strong>{`${catalog} - `}</strong>}
      {name}
    </li>
  </Typography>
));

export default Class;
