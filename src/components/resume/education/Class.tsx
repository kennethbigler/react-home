import React from 'react';
import { Typography } from '@material-ui/core';

export interface ClassProps {
  name: string;
  catalog?: string;
}

const Class: React.FC<ClassProps> = React.memo((props: ClassProps) => {
  const { name, catalog } = props;

  return (
    <Typography>
      <li>
        {catalog && <strong>{`${catalog} - `}</strong>}
        {name}
      </li>
    </Typography>
  );
});

export default Class;
