import * as React from "react";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useRecoilState } from "recoil";
import SimplePopover from "./ButtonPopover";
import playerAtom from "../../../recoil/player-atom";

const namePadStyles: React.CSSProperties = {
  maxWidth: "420px",
  width: "100%",
  display: "block",
  margin: "auto",
};

const PlayerMenu: React.FC = () => {
  const [players, setPlayers] = useRecoilState(playerAtom);

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
    (e: React.FocusEvent<HTMLInputElement>): void => {
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
      <div style={namePadStyles}>
        <Grid container spacing={1}>
          <Grid item xs={9}>
            <Typography variant="h5">Edit Player Names</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h5">Is Bot?</Typography>
          </Grid>
        </Grid>
        {players.map((p, i) =>
          p.id !== 0 ? (
            <Grid key={`${p.name},${i}`} container spacing={1}>
              <Grid item xs={9}>
                <TextField
                  defaultValue={p.name}
                  onBlur={handleBlur(p.id)}
                  placeholder="Enter Player Name"
                  title={`player ${i} name`}
                />
              </Grid>
              <Grid item xs={3}>
                {(i === 0 || !players[i].isBot || !players[i - 1].isBot) && (
                  <Switch
                    checked={players[i].isBot}
                    value={players[i].isBot}
                    onChange={(_e, isC): void => handleToggle(p.id, isC)}
                    title={`isBot-switch-${i}`}
                  />
                )}
              </Grid>
            </Grid>
          ) : (
            <Grid key={`${p.name},${i}`} container spacing={1}>
              <Grid item xs={9}>
                <Typography variant="h5">{p.name}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Switch checked disabled />
              </Grid>
            </Grid>
          ),
        )}
      </div>
    </SimplePopover>
  );
};

export default PlayerMenu;
