import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, CardTitle, CardText } from "material-ui/Card";

const styles = {
  corpLogo: {
    width: "100%",
    maxWidth: "12em"
  }
};

const Work = props => {
  return (
    <div>
      <h1>Work Experience</h1>
      {props.workExp.map(job => {
        return (
          <Card
            expanded={props.expanded[job.company]}
            onExpandChange={expanded => props.onClick(job.company, expanded)}
            key={job.company}
          >
            <CardTitle
              title={job.company + ", " + job.location}
              //avatar={job.src}
              subtitle={job.title}
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText expandable={true}>
              <div className="row">
                <div className="col-sm-9 col-xs-12">
                  <p>
                    {job.range}
                  </p>
                  <ul>
                    {job.expr.map((desc, i) => {
                      return (
                        <li key={"desc" + i}>
                          {desc}
                        </li>
                      );
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
      })}
    </div>
  );
};

Work.propTypes = {
  onClick: PropTypes.func.isRequired,
  classes: PropTypes.array.isRequired,
  expanded: PropTypes.object.isRequired
};

export default Work;
