import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { Timeline, TIMELINE_TITLE, FORMAT } from '../features/Timeline';
import moment from 'moment';
// Parents: Main

const styles = {
  corpLogo: {
    width: '100%',
    maxWidth: '12em'
  }
};

function showRange(s, e, n) {
  // start date
  const start = s.format(FORMAT);
  // end date, check if it is the present
  const end = moment().diff(e, 'days') < 1 ? 'Present' : e.format(FORMAT);
  // add optional notes
  const notes = n ? n : '';

  // get the time range in years, months
  const mon = e.diff(s, 'months') % 12;
  const yr = e.diff(s, 'years');
  const yRange = yr ? `${yr} year${yr > 1 ? 's' : ''}` : null;
  const mRange = mon ? `${mon} month${mon > 1 ? 's' : ''}` : null;
  const range = yRange ? yRange + (mRange ? `, ${mRange}` : '') : mRange;
  // works faster but is a rough estimate
  // const range = e.to(s, true);

  // return string for output
  return `${start} - ${end} (${range}) ${notes}`;
}

export const Work = props => {
  return (
    <div>
      <h1>Work Experience</h1>
      {/* Timeline */}
      <Card
        expanded={props.expanded[TIMELINE_TITLE]}
        onExpandChange={expanded => props.onClick(TIMELINE_TITLE, expanded)}
        key={TIMELINE_TITLE}
      >
        <CardTitle
          title={TIMELINE_TITLE}
          subtitle="September 2010 - Present"
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <div className="row">
            <Timeline data={props.workExp} />
          </div>
        </CardText>
      </Card>
      {/* Companies */}
      {props.workExp.map(job => {
        if (job.isJob) {
          return (
            <Card
              expanded={props.expanded[job.company]}
              onExpandChange={expanded => props.onClick(job.company, expanded)}
              key={job.company}
            >
              <CardTitle
                title={job.company + ', ' + job.location}
                //avatar={job.src}
                subtitle={job.title}
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardText expandable={true}>
                <div className="row">
                  <div className="col-sm-9 col-xs-12">
                    <p>{showRange(job.start, job.end, job.notes)}</p>
                    <ul>
                      {job.expr.map((desc, i) => {
                        return <li key={'desc' + i}>{desc}</li>;
                      })}
                    </ul>
                  </div>
                  <img
                    className="col-sm-3 col-xs-12 pull-right"
                    style={styles.corpLogo}
                    src={job.src}
                    alt={job.alt}
                  />
                </div>
              </CardText>
            </Card>
          );
        }
      })}
    </div>
  );
};

Work.propTypes = {
  onClick: PropTypes.func.isRequired,
  workExp: PropTypes.array.isRequired,
  expanded: PropTypes.object.isRequired
};
