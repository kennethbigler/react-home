import React from "react";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { updateName, updateBot } from "../../../store/modules/players";

const namePadStyles: React.CSSProperties = {
  maxWidth: "420px",
  width: "100%",
  display: "block",
  margin: "auto",
};

const PlayerMenu: React.FC = () => {
  const players = useAppSelector((state) => state.players);
  const dispatch = useAppDispatch();

  const isBot = React.useMemo(() => players.map((a) => a.isBot), [players]);

  /** toggle between bot and human player - dispatch to redux */
  const handleToggle = (id: number, isChecked: boolean): void => {
    dispatch(updateBot({ id, isBot: isChecked }));
  };

  /** update player name onBlur - dispatch to redux */
  const handleBlur =
    (id: number) =>
    (e: React.FocusEvent<HTMLInputElement>): void => {
      dispatch(updateName({ id, name: e.target.value || "" }));
    };

  /** if enter key was pressed in textfield, update name - dispatch to redux */
  const handleKeyPress =
    (id: number) =>
    (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (e.key === "Enter") {
        dispatch(
          updateName({ id, name: (e.target as HTMLInputElement).value || "" })
        );
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
