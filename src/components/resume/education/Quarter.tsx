import React from 'react';
import { Typography } from '@material-ui/core';
import Class, { ClassProps } from './Class';

export interface QuarterType {
  classes: ClassProps[];
  quarter: string;
}
interface QuarterProps {
  quarter: QuarterType;
}

const Quarter: React.FC<QuarterProps> = ({ quarter }: QuarterProps) => (
  <>
    <Typography variant="h5">
      {quarter.quarter}
    </Typography>
    <ul>
      {quarter.classes.map((c) => <Class key={c.name} name={c.name} catalog={c.catalog} />)}
    </ul>
  </>
);

export default Quarter;
