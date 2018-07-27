import React, { Component } from 'react';
import Chip from '@material-ui/core/Chip';
import map from 'lodash/map';
import ExpandableCard from '../../common/ExpandableCard';
import { techSummary, skillSummary } from '../../../constants/work';
// Parents: Main

export default class Skills extends Component {
  styles = {
    chipStyle: { marginRight: 5, marginTop: 5 },
    sidePadding: { paddingLeft: 20, paddingRight: 20 },
  };

  getCSV = (arr) => {
    const { chipStyle } = this.styles;
    return map(arr, tech => <Chip key={tech} label={tech} style={chipStyle} />);
  };

  render() {
    const { sidePadding } = this.styles;
    return (
      <ExpandableCard title="Skills">
        <div style={sidePadding}>
          <h3>
            Summary of Skills:
          </h3>
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
          <h3>
            Technologies:
          </h3>
          {this.getCSV(techSummary)}
          <hr />
          <h3>
            Skills:
          </h3>
          {this.getCSV(skillSummary)}
        </div>
      </ExpandableCard>
    );
  }
}
