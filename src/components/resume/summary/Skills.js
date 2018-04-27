import React, { Component } from 'react';
import { ExpandableCard } from '../../common/ExpandableCard';
import { techSummary } from '../../../constants/work';
import Chip from 'material-ui/Chip';
// Parents: Main

export class Skills extends Component {
  getCSV = arr => {
    // return arr.reduce((acc, cur) => `${acc}, ${cur}`);
    const style = { display: 'inline-block', marginRight: 5, marginTop: 5 };
    return arr.map(tech => (
      <Chip key={tech} style={style}>
        {tech}
      </Chip>
    ));
  };

  render() {
    return (
      <ExpandableCard title="Skills">
        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
          <h3>Summary of Skills:</h3>
          <ul>
            <li>
              Developing useful, multi-platform software tools and creating user
              interfaces
            </li>
            <li>
              Managing international team members, strong communication skills,
              team player, and detail-oriented
            </li>
            <li>
              Gathering requirements, scheduling, prioritizing goals,
              documenting processes, and creating project standards
            </li>
            <li>
              Designing, building, and overseeing production of large and small
              Internet and Intranet sites
            </li>
          </ul>
          <hr />
          <h3>Technology Skills:</h3>
          {this.getCSV(techSummary)}
        </div>
      </ExpandableCard>
    );
  }
}
