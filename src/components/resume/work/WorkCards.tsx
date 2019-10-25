import React from 'react';
import map from 'lodash/map';
import startCase from 'lodash/startCase';
import { Typography } from '@material-ui/core';
import Job from './Job';
import { Job as JobType } from '../../../constants/work';

interface WorkCardsProps {
  workExp: JobType[];
  workTypes: string[];
}

const WorkCards: React.FC<WorkCardsProps> = ({ workExp, workTypes }: WorkCardsProps) => (
  <>
    {map(workTypes, (type) => (
      <div key={type} style={{ marginTop: 25 }}>
        <Typography variant="h3">{`${startCase(type)} Experience`}</Typography>
        <hr />
        {map(workExp, (job) => (job.type === type && <Job key={job.company} job={job} />))}
      </div>
    ))}
  </>
);

export default WorkCards;
