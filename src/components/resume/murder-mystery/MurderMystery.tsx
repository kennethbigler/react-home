import React from 'react';
import { Typography } from '@mui/material';
import profiles, { CASINO, intro } from '../../../constants/murder';
import MurderMysteryPanel from './MurderMysteryPanel';

const MurderMystery: React.FC = React.memo(() => {
  const [expanded, setExpanded] = React.useState('');

  const handleChange = React.useCallback(
    (panel: string) => (_event: React.SyntheticEvent<Element, Event>, exp?: boolean): void => {
      setExpanded(exp ? panel : '');
    },
    [setExpanded],
  );

  const mmProfiles = React.useMemo(() => profiles.map((profile, i) => {
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
  }), [expanded, handleChange]);

  return (
    <>
      <Typography variant="h2" gutterBottom>{`Murder at ${CASINO}`}</Typography>
      <hr />
      <Typography variant="h5" gutterBottom>{intro}</Typography>
      {mmProfiles}
    </>
  );
});

export default MurderMystery;
