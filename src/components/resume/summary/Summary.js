import React, { Component } from 'react';
import { Info } from './Info';
import { Skills } from './Skills';
import { Education } from './Education';
import { TimelineCard } from '../work/TimelineCard';
// Parents: Main

export class Summary extends Component {
  render() {
    return (
      <div>
        <h1>Summary</h1>
        <hr />
        <Info />
        <TimelineCard />
        <Skills />
        <Education />
      </div>
    );
  }
}
