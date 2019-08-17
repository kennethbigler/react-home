import React from 'react';
import types from 'prop-types';
import map from 'lodash/map';
import startCase from 'lodash/startCase';
import { Typography } from '@material-ui/core';
import Job from './Job';
// Parents: Routes (Resume)

const styles = {
  marginTop: 25,
};

const WorkCards = ({ workExp, workTypes }) => map(workTypes, (type) => (
  <div key={type} style={styles}>
    <Typography variant="h3">{`${startCase(type)} Experience`}</Typography>
    <hr />
    {map(workExp, (job) => (job.type === type && <Job key={job.company} job={job} />))}
  </div>
));

WorkCards.propTypes = {
  workExp: types.arrayOf(types.shape({
    type: types.string.isRequired,
    company: types.string.isRequired,
  })).isRequired,
  workTypes: types.arrayOf(types.string).isRequired,
};

export default WorkCards;
