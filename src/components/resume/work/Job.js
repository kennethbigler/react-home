import React, { Component } from 'react';
import types from 'prop-types';
import { ExpandableCard } from '../../common/ExpandableCard';
import { FORMAT } from '../../common/timeline/';
import Chip from 'material-ui/Chip';
import moment from 'moment';
// Parents: Work

/** function to generate timeline card */
export class Job extends Component {
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
        diff: types.func.isRequired
      }).isRequired,
      end: types.shape({
        format: types.func.isRequired,
        diff: types.func.isRequired
      }).isRequired,
      notes: types.string,
      expr: types.arrayOf(types.string),
      tech: types.arrayOf(types.string),
      src: types.string,
      alt: types.string
    }).isRequired
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

  getCSV = arr => {
    // return arr.reduce((acc, cur) => `${acc}, ${cur}`);
    const style = { display: 'inline-block', marginRight: 5, marginBottom: 5 };
    return arr.map(tech => (
      <Chip key={tech} style={style}>
        {tech}
      </Chip>
    ));
  };

  render() {
    const { job } = this.props;

    const imgStyle = {
      width: '100%',
      maxWidth: '12em',
      height: 'auto',
      float: 'right'
    };
    const parent = job.parent ? ` (${job.parent})` : '';
    const title = `${job.company}${parent}, ${job.location}`;

    return (
      job.isJob && (
        <ExpandableCard
          title={title}
          subtitle={job.title}
          backgroundColor={job.color}
        >
          <div className="col-sm-9">
            <p>{this.showRange(job.start, job.end, job.notes)}</p>
            {job.expr && (
              <ul>
                {job.expr.map((desc, i) => <li key={`desc${i}`}>{desc}</li>)}
              </ul>
            )}
            {job.tech && (
              <div>Technologies/Skills: {this.getCSV(job.tech)}</div>
            )}
          </div>
          {job.src && (
            <div className="col-sm-3">
              <img style={imgStyle} src={job.src} alt={job.alt} />
            </div>
          )}
        </ExpandableCard>
      )
    );
  }
}
