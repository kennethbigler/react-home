import React, { Component } from 'react';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import photo from '../../images/ken.jpg';
import workExp, { REACT, ANGULAR } from '../../constants/work';
// Parents: Main

const styles = {
  image: {
    width: '100%',
    display: 'block',
    margin: 'auto',
    maxWidth: '20em'
  }
};

const getJob = () => {
  const job = workExp[0];
  const end = job.parent ? ` (${job.parent})` : '';
  return `${job.title}, ${job.company}${end}`;
};

export class Home extends Component {
  handleClick = () =>
    window.open('https://www.linkedin.com/in/kennethbigler', '_blank');

  render() {
    return (
      <div>
        <h1>Summary</h1>
        <hr />
        <div className="row">
          <div className="col-md-3">
            <img
              src={photo}
              alt="Kenneth Bigler"
              onTouchTap={this.handleClick}
              style={styles.image}
            />
          </div>
          <div className="col-md-9">
            <h2 style={{ align: 'center' }}>{getJob()}</h2>
            <Table selectable={false}>
              <TableBody displayRowCheckbox={false}>
                <TableRow>
                  <TableRowColumn>Location</TableRowColumn>
                  <TableRowColumn>Mountain View, CA</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>Interests</TableRowColumn>
                  <TableRowColumn>Computer Software</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>Volunteer Work</TableRowColumn>
                  <TableRowColumn>Second Harvest Food Bank</TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        <h3>Summary of Skills</h3>
        <hr />
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
            Gathering requirements, scheduling, prioritizing goals, documenting
            processes, and creating project standards
          </li>
          <li>
            Designing, building, and overseeing production of large and small
            Internet and Intranet sites
          </li>
        </ul>
        <h3>Computer Languages:</h3>
        <hr />
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
        <h3>Education</h3>
        <hr />
        <h4>
          <b>Santa Clara University,</b> Santa Clara, CA
        </h4>
        <ul>
          <li>
            <b>Master of Science in Computer Science and Engineering</b>
            <ul>
              <li>Emphasis: Software Engineering</li>
              <li>Graduation: December 2016</li>
              <li>GPA: 3.7</li>
            </ul>
          </li>
          <li>
            <b>Bachelor of Science in Computer Science and Engineering</b>
            <ul>
              <li>Minor: Mathematics</li>
              <li>Graduation: June 2015</li>
              <li>Dean’s List: Sept.&nbsp;2012 – Graduation</li>
              <li>GPA: 3.7</li>
            </ul>
          </li>
        </ul>
        <br />
        <h4>
          <b>Stanford University,</b> Stanford, CA
        </h4>
        <ul>
          <li>
            High School Summer College
            <ul>
              <li>June 2010 - August 2010</li>
              <li>GPA: 3.8</li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}
