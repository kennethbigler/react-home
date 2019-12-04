import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { updateName, updateBot } from '../../../store/modules/players';
import { DBRootState } from '../../../store/types';

const namePadStyles: React.CSSProperties = {
  maxWidth: '420px',
  width: '100%',
  display: 'block',
  margin: 'auto',
};

const PlayerMenu: React.FC<{}> = () => {
  const players = useSelector((state: DBRootState) => state.players);
  const dispatch = useDispatch();

  const isBot = React.useMemo(() => players.map((a) => a.isBot), [players]);

  const handleToggle = React.useCallback(
    (id: number, isChecked: boolean): void => {
      dispatch(updateBot(id, isChecked));
    },
    [dispatch],
  );

  const handleBlur = React.useCallback(
    (id: number) => (e: React.FocusEvent<HTMLInputElement>): void => {
      dispatch(updateName(id, e.target.value || ''));
    },
    [dispatch],
  );

  const handleKeyPress = React.useCallback(
    (id: number) => (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (e.key === 'Enter') {
        dispatch(updateName(id, (e.target as HTMLInputElement).value || ''));
      }
    },
    [dispatch],
  );

  return (
    <div style={namePadStyles}>
      <Grid container spacing={1}>
        <Grid item xs={9}>
          <Typography variant="h5">
            Edit Player Names
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h5">
            Is Bot?
          </Typography>
        </Grid>
      </Grid>
      {players.map((p, i) => (p.id !== 0
        ? (
          <Grid key={`${p.name},${i}`} container spacing={1}>
            <Grid item xs={9}>
              <TextField
                defaultValue={p.name}
                onBlur={handleBlur(p.id)}
                onKeyPress={handleKeyPress(p.id)}
                placeholder="Enter Player Name"
              />
            </Grid>
            <Grid item xs={3}>
              <Switch
                checked={isBot[i]}
                color="primary"
                onChange={(_e, isC): void => handleToggle(p.id, isC)}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid key={`${p.name},${i}`} container spacing={1}>
            <Grid item xs={9}>
              <Typography variant="h5">
                {p.name}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Switch checked disabled />
            </Grid>
          </Grid>
        )
      ))}
    </div>
  );
};

export default PlayerMenu;
