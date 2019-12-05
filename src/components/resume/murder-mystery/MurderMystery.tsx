import React from 'react';
import { Typography } from '@material-ui/core';
import profiles, { CASINO } from '../../../constants/murder';
import MurderMysteryPanel from './MurderMysteryPanel';

const MurderMystery: React.FC<{}> = React.memo(() => {
  const [expanded, setExpanded] = React.useState('');

  const handleChange = React.useCallback(
    (panel: string) => (_event: React.MouseEvent, exp?: string): void => {
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
      {mmProfiles}
    </>
  );
});

export default MurderMystery;
