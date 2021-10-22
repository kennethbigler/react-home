import React from 'react';
import { Typography } from '@mui/material';
import { School } from '../../../constants/classes';

const EducationSeg: React.FC<School> = React.memo(({
  degree,
  gpa,
  graduation,
  honors,
  location,
  major,
  minor,
  school,
}: School) => (
  <div>
    <Typography variant="h4">
      {`${school}, ${location}`}
    </Typography>
    <Typography variant="h5">
      {degree + (major ? ` in ${major}` : '')}
    </Typography>
    <ul>
      {minor && (
        <Typography>
          <li>{minor}</li>
        </Typography>
      )}
      {honors && (
        <Typography>
          <li>{honors}</li>
        </Typography>
      )}
      {graduation && (
        <Typography>
          <li>{`Completion: ${graduation}`}</li>
        </Typography>
      )}
      {gpa && (
        <Typography>
          <li>{`GPA: ${gpa}`}</li>
        </Typography>
      )}
    </ul>
  </div>
));

export default EducationSeg;
