import React, { Component } from 'react';
import { ExpandableCard } from '../../common/ExpandableCard';
import classes from '../../../constants/classes';
import map from 'lodash/map';
// Parents: Main

export class Education extends Component {
  getClassData = (d, i) => {
    if (d.school) {
      const major = d.major ? ` in ${d.major}` : '';
      return (
        <div key={i}>
          <h1>{`${d.school}, ${d.location}`}</h1>
          <h2>{d.degree + major}</h2>
          <ul>
            {d.minor && <li>{d.minor}</li>}
            {d.honors && <li>{d.honors}</li>}
            {d.graduation && <li>Completion: {d.graduation}</li>}
            {d.gpa && <li>GPA: {d.gpa}</li>}
          </ul>
          <hr />
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
