// react
import React, { PureComponent } from 'react';
// components
// material ui
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import ExpandableCard from '../../common/ExpandableCard';
// assests
import photo from '../../../images/ken.jpg';
import workExp from '../../../constants/work';
// Parents: Degree

export default class Info extends PureComponent {
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

  handleClick = () => window.open('https://www.linkedin.com/in/kennethbigler', '_blank');

  render() {
    const { image } = this.style;
    return (
      <Grid container spacing={16}>
        <Grid item md={3} xs={12}>
          <img
            alt="Kenneth Bigler"
            onClick={this.handleClick}
            src={photo}
            style={image}
          />
        </Grid>
        <Grid item sm={9} xs={12}>
          <ExpandableCard title={this.getJob()}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    Location
                  </TableCell>
                  <TableCell>
                    Mountain View, CA
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Interests
                  </TableCell>
                  <TableCell>
                    Computer Software
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Volunteer Work
                  </TableCell>
                  <TableCell>
                    Second Harvest Food Bank
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </ExpandableCard>
        </Grid>
      </Grid>
    );
  }
}
