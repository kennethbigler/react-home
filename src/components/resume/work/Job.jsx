import React, { Component, Fragment } from 'react';
import types from 'prop-types';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { Typography } from '@material-ui/core';
import { FORMAT } from '../../common/timeline-card/Timeline';
import ExpandableCard from '../../common/expandable-card';
// Parents: Work

/* function to generate timeline card */
class Job extends Component {
  getCSV = (arr) => {
    const style = { marginRight: 5, marginBottom: 5 };
    return map(arr, (item) => <Chip key={item} label={item} style={style} />);
  };

  showRange = (s, e, notes = '') => {
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

  render() {
    const { job } = this.props;

    const imgStyle = {
      width: '100%',
      maxWidth: '12em',
      height: 'auto',
      float: 'right',
    };
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
            {this.showRange(job.start, job.end, job.notes)}
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
              {this.getCSV(job.tech)}
            </>
          )}
          {!isEmpty(job.skills) && (
            <>
              <hr />
              <Typography display="inline">Skills:&nbsp;</Typography>
              {this.getCSV(job.skills)}
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
  }
}

Job.propTypes = {
  job: types.shape({
    parent: types.string,
    inverted: types.bool,
    company: types.string.isRequired,
    location: types.string.isRequired,
    title: types.string.isRequired,
    color: types.string.isRequired,
    start: types.shape({
      format: types.func.isRequired,
      diff: types.func.isRequired,
    }).isRequired,
    end: types.shape({
      format: types.func.isRequired,
      diff: types.func.isRequired,
    }).isRequired,
    notes: types.string,
    expr: types.arrayOf(types.string),
    tech: types.arrayOf(types.string),
    skills: types.arrayOf(types.string),
    src: types.string,
    alt: types.string,
  }).isRequired,
};

export default Job;
