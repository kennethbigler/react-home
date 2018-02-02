import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText } from 'material-ui/Card';
// Parents: Main

export const Education = props => {
  return (
    <div>
      <h1>Education and Extracurriculars</h1>
      {props.classes.map(degree => {
        return (
          <Card
            expanded={props.expanded[degree.degree]}
            onExpandChange={expanded =>
              props.onTouchTap(degree.degree, expanded)
            }
            key={degree.degree}
          >
            <CardTitle
              title={
                degree.degree + (degree.major ? ' in ' + degree.major : '')
              }
              //avatar={job.src}
              subtitle={
                degree.gpa
                  ? 'GPA: ' + degree.gpa + ' - Graduation: ' + degree.graduation
                  : degree.subtitle
              }
              actAsExpander
              showExpandableButton
            />
            <CardText expandable>
              <div className="row">
                {degree.years.map(year => {
                  return (
                    <div
                      key={year.year}
                      className={
                        'col-md-' + Math.ceil(12 / degree.years.length)
                      }
                    >
                      <h3>{year.year}</h3>
                      <hr />
                      {year.quarters.map(quarter => {
                        return (
                          <div key={quarter.quarter}>
                            <h4>{quarter.quarter}</h4>
                            <ul>
                              {quarter.classes.map(classes => {
                                return <li key={classes}>{classes}</li>;
                              })}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </CardText>
          </Card>
        );
      })}
    </div>
  );
};

Education.propTypes = {
  onTouchTap: PropTypes.func.isRequired,
  classes: PropTypes.array.isRequired,
  expanded: PropTypes.object.isRequired
};
