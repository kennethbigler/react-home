import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { Timeline, TIMELINE_TITLE, FORMAT } from '../common/Timeline';
import moment from 'moment';
// Parents: Main

function showRange(s, e, n) {
  // start date
  const start = s.format(FORMAT);
  // end date, check if it is the present
  const end = moment().diff(e, 'days') < 1 ? 'Present' : e.format(FORMAT);
  // add optional notes
  const notes = n ? n : '';

  // get the time range in years, months
  const mon = e.diff(s, 'months') % 12 + 1; // working Jan&Feb > (2 - 1 = 1)
  const yr = e.diff(s, 'years');
  const yRange = yr ? `${yr} year${yr > 1 ? 's' : ''}` : null;
  const mRange = mon ? `${mon} month${mon > 1 ? 's' : ''}` : null;
  const range = yRange ? yRange + (mRange ? `, ${mRange}` : '') : mRange;

  // return string for output
  return `${start} - ${end} (${range}) ${notes}`;
}

export class Work extends Component {
  /** function to generate timeline card */
  genTimeline = () => {
    const { onTouchTap, workExp, expanded } = this.props;

    return (
      <Card
        expanded={expanded[TIMELINE_TITLE]}
        onExpandChange={expanded => onTouchTap(TIMELINE_TITLE, expanded)}
        key={TIMELINE_TITLE}
      >
        <CardTitle
          title={TIMELINE_TITLE}
          subtitle="September 2010 - Present"
          actAsExpander
          showExpandableButton
        />
        <CardText expandable>
          <div className="row">
            <Timeline data={workExp} />
          </div>
        </CardText>
      </Card>
    );
  };

  /** function to generate timeline card */
  genWorkExp = job => {
    const { onTouchTap, expanded } = this.props;
    const imgStyle = { width: '100%', maxWidth: '12em', height: 'auto' };
    const mainTxt = 'col-sm-9 col-xs-12';
    const sideTxt = 'col-sm-3 col-xs-12';

    return job.isJob ? (
      <Card
        expanded={expanded[job.company]}
        onExpandChange={expanded => onTouchTap(job.company, expanded)}
        key={job.company}
      >
        <CardTitle
          title={`${job.company}, ${job.location}`}
          //avatar={job.src}
          subtitle={job.title}
          actAsExpander
          showExpandableButton
        />
        <CardText expandable>
          <div className="row">
            <div className={mainTxt}>
              <p>{showRange(job.start, job.end, job.notes)}</p>
              <ul>
                {job.expr.map((desc, i) => {
                  return <li key={`desc${i}`}>{desc}</li>;
                })}
              </ul>
            </div>
            <div className={sideTxt}>
              <img
                className="float-right"
                style={imgStyle}
                src={job.src}
                alt={job.alt}
              />
            </div>
          </div>
        </CardText>
      </Card>
    ) : (
      <div key={job.company} />
    );
  };

  render() {
    const { workExp } = this.props;
    return (
      <div>
        <h1>Work Experience</h1>
        {this.genTimeline()}
        {workExp.map(this.genWorkExp)}
      </div>
    );
  }
}

Work.propTypes = {
  onTouchTap: PropTypes.func.isRequired,
  workExp: PropTypes.array.isRequired,
  expanded: PropTypes.object.isRequired
};
