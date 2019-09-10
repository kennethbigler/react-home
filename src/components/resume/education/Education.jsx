import React, { memo, Fragment } from 'react';
import map from 'lodash/map';
import { Typography } from '@material-ui/core';
import Degree from './Degree';
import classes from '../../../constants/classes';
// Parents: Main

const Education = memo(() => (
  <Fragment>
    <Typography variant="h2">Hackathons &amp; Education</Typography>
    {map(classes, (d) => <Degree key={d.degree} degree={d} />)}
  </Fragment>
));

export default Education;
