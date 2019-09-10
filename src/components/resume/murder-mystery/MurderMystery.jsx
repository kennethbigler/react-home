import React, { useState, memo, Fragment } from 'react';
import map from 'lodash/map';
import { Typography } from '@material-ui/core';
import profiles, { CASINO } from '../../../constants/murder';
import MurderMysteryPanel from './MurderMysteryPanel';
// Parents: Main

const MurderMystery = memo(() => {
  const [expanded, setExpanded] = useState(null);

  const handleChange = (panel) => (event, exp) => {
    setExpanded(exp ? panel : null);
  };

  return (
    <Fragment>
      <Typography variant="h2" gutterBottom>{`Murder at ${CASINO}`}</Typography>
      {map(profiles, (profile, i) => {
        const {
          role, importance, person, gender, description, hint, clue,
        } = profile;

        return (
          <MurderMysteryPanel {...{
            key: i,
            expanded,
            role,
            importance,
            person,
            gender,
            description,
            hint,
            clue,
            expandedKey: `${i}`,
            handleChange,
          }}
          />
        );
      })}
    </Fragment>
  );
});

export default MurderMystery;
