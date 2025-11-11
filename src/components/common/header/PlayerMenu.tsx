import { memo, Fragment, FocusEvent } from "react";
import { useAtom } from "jotai";
import SimplePopover from "./ButtonPopover";
import playerAtom from "../../../jotai/player-atom";
import { Switch, TextField, Grid, Typography } from "@mui/material";

const PlayerMenu = memo(() => {
  const [players, setPlayers] = useAtom(playerAtom);

  /** toggle between bot and human player */
  const handleToggle = (id: number, isChecked: boolean): void => {
    const pi = players.findIndex((p) => p.id === id);
    if (pi !== -1) {
      if (isChecked) {
        const newPlayers = [...players];
        for (let i = pi; i < players.length - 1; i += 1) {
          const newPlayer = { ...newPlayers[i], isBot: isChecked };
          newPlayers[i] = newPlayer;
        }
        setPlayers(newPlayers);
      } else {
        const newPlayers = [...players];
        const newPlayer = { ...newPlayers[pi], isBot: isChecked };
        newPlayers[pi] = newPlayer;
        setPlayers(newPlayers);
      }
    }
  };

  /** update player name onBlur */
  const handleBlur =
    (id: number) =>
    (e: FocusEvent<HTMLInputElement>): void => {
      const pi = players.findIndex((p) => p.id === id);
      if (pi !== -1) {
        const newPlayers = [...players];
        const newPlayer = { ...newPlayers[pi], name: e.target.value || "" };
        newPlayers[pi] = newPlayer;
        setPlayers(newPlayers);
      }
    };

  return (
    <SimplePopover buttonText="Players">
      <Grid container spacing={1} sx={{ maxWidth: 310 }}>
        <Grid size={8}>
          <Typography variant="h5">Edit Player Names</Typography>
        </Grid>
        <Grid size={4}>
          <Typography variant="h5">Is Bot?</Typography>
        </Grid>
        {players.map((p, i) =>
          p.id !== 0 ? (
            <Fragment key={`${p.name},${i}`}>
              <Grid size={9}>
                <TextField
                  defaultValue={p.name}
                  onBlur={handleBlur(p.id)}
                  placeholder="Enter Player Name"
                  title={`player ${i} name`}
                />
              </Grid>
              <Grid size={3}>
                {(i === 0 || !players[i].isBot || !players[i - 1].isBot) && (
                  <Switch
                    checked={players[i].isBot}
                    value={players[i].isBot}
                    onChange={(_e, isC): void => handleToggle(p.id, isC)}
                    title={`isBot-switch-${i}`}
                  />
                )}
              </Grid>
            </Fragment>
          ) : (
            <Fragment key={`${p.name},${i}`}>
              <Grid size={9}>
                <Typography variant="h5">{p.name}</Typography>
              </Grid>
              <Grid size={3}>
                <Switch checked disabled />
              </Grid>
            </Fragment>
          ),
        )}
      </Grid>
    </SimplePopover>
  );
});

PlayerMenu.displayName = "PlayerMenu";

export default PlayerMenu;
