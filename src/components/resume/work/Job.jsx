// react
import React, { Component } from 'react';
import types from 'prop-types';
// components
// material-ui
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
// functions
import moment from 'moment';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { FORMAT } from '../../common/timeline';
import ExpandableCard from '../../common/ExpandableCard';
// Parents: Work

/* function to generate timeline card */
export default class Job extends Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    job: types.shape({
      parent: types.string,
      company: types.string.isRequired,
      location: types.string.isRequired,
      isJob: types.bool.isRequired,
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

  getCSV = (arr) => {
    const style = { marginRight: 5, marginBottom: 5 };
    return map(arr, item => <Chip key={item} label={item} style={style} />);
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
      job.isJob && (
        <ExpandableCard
          backgroundColor={job.color}
          subtitle={job.title}
          title={title}
        >
          <Grid item sm={9} xs={12}>
            <p>
              {this.showRange(job.start, job.end, job.notes)}
            </p>
            {job.expr && (
              <ul>
                {map(job.expr, (desc, i) => (
                  <li key={`desc${i}`}>
                    {desc}
                  </li>
                ))}
              </ul>
            )}
            {!isEmpty(job.tech) && (
              <div>
                <hr />
                Technologies:&nbsp;
                {this.getCSV(job.tech)}
              </div>
            )}
            {!isEmpty(job.skills) && (
              <div>
                <hr />
                Skills:&nbsp;
                {this.getCSV(job.skills)}
              </div>
            )}
          </Grid>
          {job.src && (
            <Grid item sm={3} xs={12}>
              <img alt={job.alt} src={job.src} style={imgStyle} />
            </Grid>
          )}
        </ExpandableCard>
      )
    );
  }
}
