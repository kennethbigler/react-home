import React from "react";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useRecoilState } from "recoil";
import playerAtom from "../../../recoil/player-atom";

const namePadStyles: React.CSSProperties = {
  maxWidth: "420px",
  width: "100%",
  display: "block",
  margin: "auto",
};

const PlayerMenu: React.FC = () => {
  const [players, setPlayers] = useRecoilState(playerAtom);

  const isBot = React.useMemo(() => players.map((a) => a.isBot), [players]);

  /** toggle between bot and human player - dispatch to redux */
  const handleToggle = (id: number, isChecked: boolean): void => {
    const pi = players.findIndex((p) => p.id === id);
    if (pi !== -1) {
      const newPlayers = [...players];
      const newPlayer = { ...newPlayers[pi], isBot: isChecked };
      newPlayers[pi] = newPlayer;
      setPlayers(newPlayers);
    }
  };

  /** update player name onBlur - dispatch to redux */
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

  /** if enter key was pressed in textfield, update name - dispatch to redux */
  const handleKeyPress =
    (id: number) =>
    (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (e.key === "Enter") {
        const pi = players.findIndex((p) => p.id === id);
        if (pi !== -1) {
          const newPlayers = [...players];
          const newPlayer = {
            ...newPlayers[pi],
            name: (e.target as HTMLInputElement).value || "",
          };
          newPlayers[pi] = newPlayer;
          setPlayers(newPlayers);
        }
      }
    };

  return (
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
                onKeyPress={handleKeyPress(p.id)}
                placeholder="Enter Player Name"
                title={`player ${i} name`}
              />
            </Grid>
            <Grid item xs={3}>
              <Switch
                checked={isBot[i]}
                value={isBot[i]}
                color="primary"
                onChange={(_e, isC): void => handleToggle(p.id, isC)}
                title={`isBot-switch-${i}`}
              />
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
        )
      )}
    </div>
  );
};

export default PlayerMenu;
