import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText } from 'material-ui/Card';
// Parents: Main

export class Education extends Component {
  /** render code for each class */
  renderClasses = classes => <li key={classes}>{classes}</li>;

  /** render code for each quarter */
  renderQuarter = quarter => (
    <div key={quarter.quarter}>
      <h4>{quarter.quarter}</h4>
      <ul>{quarter.classes.map(this.renderClasses)}</ul>
    </div>
  );

  /** render code for each year */
  renderYear = (year, len) => {
    return (
      <div key={year.year} className={`col-md-${Math.ceil(12 / len)}`}>
        <h3>{year.year}</h3>
        <hr />
        {year.quarters.map(this.renderQuarter)}
      </div>
    );
  };

  /** render code for each degree */
  renderDegree = d => {
    const { expanded, onTouchTap } = this.props;
    return (
      <Card
        expanded={expanded[d.degree]}
        onExpandChange={expanded => onTouchTap(d.degree, expanded)}
        key={d.degree}
      >
        <CardTitle
          title={`${d.degree}${d.major ? ` in ${d.major}` : ''}`}
          //avatar={job.src}
          subtitle={
            d.gpa ? `GPA: ${d.gpa} - Graduation: ${d.graduation}` : d.subtitle
          }
          actAsExpander
          showExpandableButton
        />
        <CardText expandable>
          <div className="row">
            {d.years.map(year => this.renderYear(year, d.years.length))}
          </div>
        </CardText>
      </Card>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <h1>Education and Extracurriculars</h1>
        {classes.map(this.renderDegree)}
      </div>
    );
  }
}

Education.propTypes = {
  onTouchTap: PropTypes.func.isRequired,
  classes: PropTypes.array.isRequired,
  expanded: PropTypes.object.isRequired
};
