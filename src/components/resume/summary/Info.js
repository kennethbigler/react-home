// react
import React, { Component } from 'react';
// material ui
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
// assests
import photo from '../../../images/ken.jpg';
import workExp from '../../../constants/work';
// Parents: Degree

/** render code for each class */
export class Info extends Component {
  style = {
    image: {
      width: '100%',
      display: 'block',
      margin: 'auto',
      maxWidth: '20em',
      marginBottom: '1em'
    }
  };

  getJob = () => {
    const job = workExp[0];
    const parent = job.parent ? ` (${job.parent})` : '';
    return `${job.title}, ${job.company}${parent}`;
  };

  handleClick = () =>
    window.open('https://www.linkedin.com/in/kennethbigler', '_blank');

  render() {
    const { image } = this.style;
    return (
      <div className="row">
        <div className="col-md-3">
          <img
            src={photo}
            alt="Kenneth Bigler"
            onTouchTap={this.handleClick}
            style={image}
          />
        </div>
        <div className="col-md-9">
          <h2 style={{ align: 'center' }}>{this.getJob()}</h2>
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
    );
  }
}
