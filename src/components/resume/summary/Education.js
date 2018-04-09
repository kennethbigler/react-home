import React, { Component } from 'react';
import { ExpandableCard } from '../../common/ExpandableCard';
import { orange500 } from 'material-ui/styles/colors';
import classes from '../../../constants/classes';
// Parents: Main

export class Education extends Component {
  getClassData = (d, i) => {
    if (d.school) {
      const major = d.major ? ` in ${d.major}` : '';
      return (
        <div key={i}>
          <h4>{`${d.school}, ${d.location}`}</h4>
          <b>{d.degree + major}</b>
          <ul>
            {d.minor && <li>{d.minor}</li>}
            {d.honors && <li>{d.honors}</li>}
            {d.graduation && <li>Completion: {d.graduation}</li>}
            {d.gpa && <li>GPA: {d.gpa}</li>}
          </ul>
        </div>
      );
    }
    return null;
  };

  render() {
    return (
      <ExpandableCard title="Education" backgroundColor={orange500}>
        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
          {classes.map(this.getClassData)}
        </div>
      </ExpandableCard>
    );
  }
}
