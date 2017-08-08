import React, { Component } from "react";
import { Card, CardHeader, CardText } from "material-ui/Card";
import classes from "../../constants/classes";

class Classes extends Component {
  constructor(props) {
    super(props);
    // set expanded state for each class
    let expanded = {};
    classes.forEach(degree => {
      expanded[degree.degree] = true;
    });
    this.state = { expanded };
  }

  // toggle expanded state
  handleExpandChange = (key, exp) => {
    let expanded = this.state.expanded;
    expanded[key] = exp;
    this.setState({ expanded });
  };

  render() {
    return (
      <div>
        <h1>Education</h1>
        {classes.map(degree => {
          return (
            <Card
              expanded={this.state.expanded[degree.degree]}
              onExpandChange={expanded =>
                this.handleExpandChange(degree.degree, expanded)}
              key={degree.degree}
            >
              <CardHeader
                title={
                  degree.degree + (degree.major ? " in " + degree.major : "")
                }
                //avatar={job.src}
                subtitle={
                  degree.gpa
                    ? "GPA: " +
                      degree.gpa +
                      " - Graduation: " +
                      degree.graduation
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
  }
}

export default Classes;
