import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import ExpandableCard from '../../common/expandable-card';
import photo from '../../../images/ken.jpg';
import workExp from '../../../constants/work';

const imageStyles: React.CSSProperties = {
  width: '95%',
  display: 'block',
  margin: 'auto',
  marginBottom: '1em',
};

const Info: React.FC<{}> = React.memo(() => {
  const getJob = (): string => {
    const job = workExp[0];
    const parent = job.parent ? ` (${job.parent})` : '';
    return `${job.title}, ${job.company}${parent}`;
  };

  const handleClick = (): void => {
    window.open('https://www.linkedin.com/in/kennethbigler', 'linkedIn');
  };

  return (
    <Grid container spacing={1}>
      <Grid item md={4} xs={12}>
        <img
          alt="Kenneth Bigler"
          onClick={handleClick}
          src={photo}
          style={imageStyles}
        />
      </Grid>
      <Grid item md={8} xs={12}>
        <ExpandableCard title={getJob()}>
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
});

export default Info;
