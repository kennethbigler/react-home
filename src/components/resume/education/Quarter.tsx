import React from 'react';
import map from 'lodash/map';
import { Typography } from '@material-ui/core';
import Class, { ClassProps } from './Class';

export interface QuarterType {
  classes: ClassProps[];
  quarter: string;
}
interface QuarterProps {
  quarter: QuarterType;
}

const Quarter: React.FC<QuarterProps> = (props: QuarterProps) => {
  const { quarter } = props;
  return (
    <>
      <Typography variant="h5">
        {quarter.quarter}
      </Typography>
      <ul>
        {map(quarter.classes, (c) => <Class key={c.name} name={c.name} catalog={c.catalog} />)}
      </ul>
    </>
  );
};

export default Quarter;
