import React from 'react';
import { REACT, ANGULAR } from '../../../constants/work';
// Parents: Main

export const Skills = () => {
  return (
    <div>
      <br />
      <h3>Summary of Skills</h3>
      <hr />
      <ul>
        <li>
          Developing useful, multi-platform software tools and creating user
          interfaces
        </li>
        <li>
          Managing international team members, strong communication skills, team
          player, and detail-oriented
        </li>
        <li>
          Gathering requirements, scheduling, prioritizing goals, documenting
          processes, and creating project standards
        </li>
        <li>
          Designing, building, and overseeing production of large and small
          Internet and Intranet sites
        </li>
      </ul>
      <h4>Computer Languages:</h4>
      <ul>
        <li>
          <b>Programming Languages:</b>&nbsp; {REACT}, {ANGULAR}, JavaScript,
          Bootstrap 3, CSS3, HTML5, AWS SDK for Javascript in Browser, Swift,
          C++, C#, C, Java, Android, SQL
        </li>
        <li>
          <b>Miscellaneous Web Skills:</b>&nbsp; Adobe Creative Suite
          (Dreamweaver, Photoshop, Illustrator, Fireworks, InDesign),
          ServiceNow, WordPress, Joomla
        </li>
      </ul>
    </div>
  );
};
