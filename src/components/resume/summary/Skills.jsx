import React, { PureComponent } from 'react';
import Chip from '@material-ui/core/Chip';
import map from 'lodash/map';
import { Typography } from '@material-ui/core';
import ExpandableCard from '../../common/ExpandableCard';
import { techSummary, skillSummary } from '../../../constants/work';
// Parents: Main

export default class Skills extends PureComponent {
  styles = {
    chipStyle: { marginRight: 5, marginTop: 5 },
    sidePadding: { paddingLeft: 20, paddingRight: 20 },
  };

  getCSV = (arr) => {
    const { chipStyle } = this.styles;
    return map(arr, (tech) => <Chip key={tech} label={tech} style={chipStyle} />);
  };

  render() {
    const { sidePadding } = this.styles;
    return (
      <ExpandableCard title="Skills">
        <div style={sidePadding}>
          <Typography variant="h4">
            Summary of Skills:
          </Typography>
          <ul>
            <Typography>
              <li>
                Developing useful, multi-platform software tools and creating user
                interfaces
              </li>
            </Typography>
            <Typography>
              <li>
                Managing international team members, strong communication skills,
                team player, and detail-oriented
              </li>
            </Typography>
            <Typography>
              <li>
                Gathering requirements, scheduling, prioritizing goals,
                documenting processes, and creating project standards
              </li>
            </Typography>
            <Typography>
              <li>
                Designing, building, and overseeing production of large and small
                Internet and Intranet sites
              </li>
            </Typography>
          </ul>
          <hr />
          <Typography variant="h4">
            Technologies:
          </Typography>
          {this.getCSV(techSummary)}
          <hr />
          <Typography variant="h4">
            Skills:
          </Typography>
          {this.getCSV(skillSummary)}
        </div>
      </ExpandableCard>
    );
  }
}
