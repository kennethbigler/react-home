// react
import React, {Component} from 'react';
// components
import {ExpandableCard} from '../../common/ExpandableCard';
// material ui
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
// assests
import photo from '../../../images/ken.jpg';
import workExp from '../../../constants/work';
// Parents: Degree

export class Info extends Component {
  style = {
    image: {
      width: '100%',
      display: 'block',
      margin: 'auto',
      maxWidth: '20em',
      marginBottom: '1em',
    },
  };

  getJob = () => {
    const job = workExp[0];
    const parent = job.parent ? ` (${job.parent})` : '';
    return `${job.title}, ${job.company}${parent}`;
  };

  handleClick = () =>
    window.open('https://www.linkedin.com/in/kennethbigler', '_blank');

  render() {
    const {image} = this.style;
    return (
      <div className="row">
        <div className="col-md-3">
          <img
            alt="Kenneth Bigler"
            onClick={this.handleClick}
            src={photo}
            style={image}
          />
        </div>
        <div className="col-md-9">
          <ExpandableCard title={this.getJob()}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>Mountain View, CA</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Interests</TableCell>
                  <TableCell>Computer Software</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Volunteer Work</TableCell>
                  <TableCell>Second Harvest Food Bank</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </ExpandableCard>
        </div>
      </div>
    );
  }
}
