import React from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardText } from "material-ui/Card";

const Education = props => {
  return (
    <div>
      <h1>Education and Extracurriculars</h1>
      {props.classes.map(degree => {
        return (
          <Card
            expanded={props.expanded[degree.degree]}
            onExpandChange={expanded => props.onClick(degree.degree, expanded)}
            key={degree.degree}
          >
            <CardHeader
              title={
                degree.degree + (degree.major ? " in " + degree.major : "")
              }
              //avatar={job.src}
              subtitle={
                degree.gpa
                  ? "GPA: " + degree.gpa + " - Graduation: " + degree.graduation
                  : degree.subtitle
              }
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText expandable={true}>
              <div className="row">
                {degree.years.map(year => {
                  return (
                    <div
                      key={year.year}
                      className={
                        "col-md-" + Math.ceil(12 / degree.years.length)
                      }
                    >
                      <h3>
                        {year.year}
                      </h3>
                      <hr />
                      {year.quarters.map(quarter => {
                        return (
                          <div key={quarter.quarter}>
                            <h4>
                              {quarter.quarter}
                            </h4>
                            <ul>
                              {quarter.classes.map(classes => {
                                return (
                                  <li key={classes}>
                                    {classes}
                                  </li>
                                );
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
  onClick: PropTypes.func.isRequired,
  classes: PropTypes.array.isRequired,
  expanded: PropTypes.object.isRequired
};

export default Education;
