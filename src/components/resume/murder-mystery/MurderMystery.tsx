import React, { useState, memo } from 'react';
import map from 'lodash/map';
import { Typography } from '@material-ui/core';
import profiles, { CASINO } from '../../../constants/murder';
import MurderMysteryPanel from './MurderMysteryPanel';

const MurderMystery: React.FC<{}> = memo(() => {
  const [expanded, setExpanded] = useState('');

  const handleChange = (panel: string) => (_event: React.MouseEvent, exp?: string): void => {
    setExpanded(exp ? panel : '');
  };

  return (
    <>
      <Typography variant="h2" gutterBottom>{`Murder at ${CASINO}`}</Typography>
      {map(profiles, (profile, i) => {
        const {
          role, importance, gender, description, hint, clue,
        } = profile;

        return (
          <MurderMysteryPanel {...{
            key: i,
            expanded,
            role,
            importance,
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
    </>
  );
});

export default MurderMystery;
