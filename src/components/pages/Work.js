import React, { Component } from "react";
import { Card, CardHeader, CardText } from "material-ui/Card";
import workExp from "../../constants/work";

const styles = {
  corpLogo: {
    width: "100%",
    maxWidth: "12em"
  }
};

class Work extends Component {
  constructor(props) {
    super(props);
    let expanded = {};
    workExp.forEach(job => {
      expanded[job.company] = true;
    });
    this.state = { expanded };
  }

  handleExpandChange = (company, exp) => {
    let expanded = this.state.expanded;
    expanded[company] = exp;
    this.setState({ expanded });
  };

  render() {
    return (
      <div>
        <h1>Work Experience</h1>
        {workExp.map(job => {
          return (
            <Card
              expanded={this.state.expanded[job.company]}
              onExpandChange={expanded =>
                this.handleExpandChange(job.company, expanded)}
              key={job.company}
            >
              <CardHeader
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
  }
}

export default Work;
