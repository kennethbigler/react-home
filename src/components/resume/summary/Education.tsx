import React from 'react';
import { Typography } from '@material-ui/core';
import ExpandableCard from '../../common/expandable-card';
import classes, { School } from '../../../constants/classes';

const Education: React.FC<{}> = React.memo(() => (
  <ExpandableCard title="Education">
    <div style={{ paddingLeft: 20, paddingRight: 20 }}>
      {classes.map((d: School, i: number): React.ReactNode => {
        if (d.school) {
          const major = d.major ? ` in ${d.major}` : '';
          return (
            <div key={i}>
              {i !== 0 && <hr />}
              <Typography variant="h4">
                {`${d.school}, ${d.location}`}
              </Typography>
              <Typography variant="h5">
                {d.degree + major}
              </Typography>
              <ul>
                {d.minor && (
                <Typography>
                  <li>{d.minor}</li>
                </Typography>
                )}
                {d.honors && (
                <Typography>
                  <li>{d.honors}</li>
                </Typography>
                )}
                {d.graduation && (
                <Typography>
                  <li>{`Completion: ${d.graduation}`}</li>
                </Typography>
                )}
                {d.gpa && (
                <Typography>
                  <li>{`GPA: ${d.gpa}`}</li>
                </Typography>
                )}
              </ul>
            </div>
          );
        }
        return null;
      })}
    </div>
  </ExpandableCard>
));

export default Education;
