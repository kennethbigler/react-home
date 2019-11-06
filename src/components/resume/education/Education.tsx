import React, { memo } from 'react';
import { Typography } from '@material-ui/core';
import Degree from './Degree';
import classes from '../../../constants/classes';

/* Education  ->  Degree  -> Year  ->  Quarter  ->  Class */
const Education = memo(() => (
  <>
    <Typography variant="h2">Hackathons &amp; Education</Typography>
    {classes.map((d) => <Degree key={d.degree} degree={d} />)}
  </>
));

export default Education;
