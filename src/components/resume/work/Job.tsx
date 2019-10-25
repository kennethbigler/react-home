import React from 'react';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import moment, { Moment } from 'moment';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { Typography } from '@material-ui/core';
import { FORMAT } from '../../common/timeline-card/Timeline';
import ExpandableCard from '../../common/expandable-card';
import { Job as JobType } from '../../../constants/work';

interface JobProps {
  job: JobType;
}

const imgStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '12em',
  height: 'auto',
  float: 'right',
};

const Job: React.FC<JobProps> = (props: JobProps) => {
  const getCSV = (arr?: string[]): React.ReactNodeArray => {
    const style = { marginRight: 5, marginBottom: 5 };
    return map(arr, (item) => <Chip key={item} label={item} style={style} />);
  };

  const showRange = (s: Moment, e: Moment, notes = ''): string => {
    // start date
    const start = s.format(FORMAT);
    // end date, check if it is the present
    const end = moment().diff(e, 'days') < 1 ? 'Present' : e.format(FORMAT);

    // get the time range in years, months
    const mon = (e.diff(s, 'months') + 1) % 12;
    const yr = e.diff(s, 'years') + (mon === 0 ? 1 : 0);
    const yRange = yr ? `${yr} year${yr > 1 ? 's' : ''}` : null;
    const mRange = mon ? `${mon} month${mon > 1 ? 's' : ''}` : 0;
    const range = yRange ? yRange + (mRange ? `, ${mRange}` : '') : mRange;

    // return string for output
    return `${start} - ${end} (${range}) ${notes}`;
  };

  const { job } = props;

  const parent = job.parent ? ` (${job.parent})` : '';
  const title = `${job.company}${parent}, ${job.location}`;

  return (
    <ExpandableCard
      backgroundColor={job.color}
      subtitle={job.title}
      inverted={job.inverted}
      title={title}
    >
      <Grid item sm={9} xs={12}>
        <Typography>
          {showRange(job.start, job.end, job.notes)}
        </Typography>
        {job.expr && (
        <ul>
          {map(job.expr, (desc, i) => (
            <Typography key={`desc${i}`}>
              <li>
                {desc}
              </li>
            </Typography>
          ))}
        </ul>
        )}
        {!isEmpty(job.tech) && (
          <>
            <hr />
            <Typography display="inline">Technologies:&nbsp;</Typography>
              {getCSV(job.tech)}
          </>
        )}
        {!isEmpty(job.skills) && (
          <>
            <hr />
            <Typography display="inline">Skills:&nbsp;</Typography>
              {getCSV(job.skills)}
          </>
        )}
      </Grid>
      {job.src && (
      <Grid item sm={3} xs={12}>
        <img alt={job.alt} src={job.src} style={imgStyle} />
      </Grid>
      )}
    </ExpandableCard>
  );
};

export default Job;
