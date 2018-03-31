import React, { Component } from 'react';
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
            <li>Completion: {d.graduation}</li>
            <li>GPA: {d.gpa}</li>
          </ul>
        </div>
      );
    }
    return null;
  };

  render() {
    return (
      <div>
        <h3>Education</h3>
        <hr />
        {classes.map(this.getClassData)}
      </div>
    );
  }
}
