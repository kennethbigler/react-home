import React, { memo } from 'react';
import { Typography } from '@material-ui/core';

interface ClassProps {
  name: string;
  catalog?: string;
}

const Class: React.FC<ClassProps> = memo((props: ClassProps) => {
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
