import React, { PureComponent } from 'react';
import map from 'lodash/map';
import { Typography } from '@material-ui/core';
import ExpandableCard from '../../common/expandable-card';
import classes from '../../../constants/classes';
// Parents: Main

export default class Education extends PureComponent {
  getClassData = (d, i) => {
    if (d.school) {
      const major = d.major ? ` in ${d.major}` : '';
      return (
        <div key={i}>
          {i !== 0 && <hr />}
          <Typography variant="h4">
            {`${d.school}, ${d.location}`}
          </Typography>
          <Typography variant="h5">
            {d.degree + major}
          </Typography>
          <ul>
            {d.minor && (
              <Typography>
                <li>
                  {d.minor}
                </li>
              </Typography>
            )}
            {d.honors && (
              <Typography>
                <li>
                  {d.honors}
                </li>
              </Typography>
            )}
            {d.graduation && (
              <Typography>
                <li>
                  {`Completion: ${d.graduation}`}
                </li>
              </Typography>
            )}
            {d.gpa && (
              <Typography>
                <li>
                  {`GPA: ${d.gpa}`}
                </li>
              </Typography>
            )}
          </ul>
        </div>
      );
    }
    return null;
  };

  render() {
    return (
      <ExpandableCard title="Education">
        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
          {map(classes, this.getClassData)}
        </div>
      </ExpandableCard>
    );
  }
}
