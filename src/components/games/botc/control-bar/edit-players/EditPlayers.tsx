import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Remove from "@mui/icons-material/Remove";
import Typography from "@mui/material/Typography";
import {
  BotCPlayer,
  BOTC_MAX_PLAYERS,
  BOTC_MIN_PLAYERS,
} from "../../../../../jotai/botc-atom";
import EditNameAndPos from "./EditNameAndPos";
import ScriptSelect from "./ScriptSelect";
import ScriptControls from "./ScriptControls";
import { playerDist } from "../../../../../constants/botc";
import { useEditPlayers } from "../../useBotC";

interface EditPlayersProps {
  botcPlayers: BotCPlayer[];
  numPlayers: number;
  numTravelers: number;
  handleReset: () => void;
}

/** EditPlayers -> ScriptSelect
 *              -> ScriptControls
 *              -> players.map(EditNameAndPos) */
const EditPlayers = ({
  botcPlayers,
  numPlayers,
  numTravelers,
  handleReset,
}: EditPlayersProps) => {
  const {
    isText,
    script,
    updateNames,
    updateNumPlayers,
    updateNumTravelers,
    updatePlayerOrder,
    updateScript,
    updateText,
  } = useEditPlayers();

  const decrPlayers = () => updateNumPlayers(numPlayers - 1);
  const incrPlayers = () => updateNumPlayers(numPlayers + 1);
  const handleClick = (n: number) => () => updateNumTravelers(n);

  return (
    <Grid container spacing={1}>
      <Grid size={12} sx={{ textAlign: "center" }}>
        <ScriptSelect script={script} onChange={updateScript} />
        <ScriptControls
          isText={isText}
          onChange={updateText}
          onReset={handleReset}
        />
      </Grid>

      <Grid size={12}>
        <IconButton
          onClick={decrPlayers}
          disabled={numPlayers <= BOTC_MIN_PLAYERS}
          aria-label="remove player"
        >
          <Remove />
        </IconButton>
        <Typography display="inline">
          Players: {numPlayers} / Dist: {playerDist[numPlayers]}
        </Typography>
        <IconButton
          onClick={incrPlayers}
          disabled={numPlayers >= BOTC_MAX_PLAYERS}
          aria-label="add player"
        >
          <Add />
        </IconButton>
      </Grid>

      <Grid size={12}>
        <Typography>Travelers</Typography>
        <ButtonGroup aria-label="select number of travelers">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <Button
              key={n}
              variant={numTravelers === n ? "contained" : "outlined"}
              onClick={handleClick(n)}
              aria-label={`${n} traveler`}
            >
              {n}
            </Button>
          ))}
        </ButtonGroup>
      </Grid>

      {botcPlayers.map(
        (player, i) =>
          i < numPlayers + numTravelers && (
            <EditNameAndPos
              key={`player${i}-${player.name}`}
              first={i === 0}
              last={i === numPlayers + numTravelers - 1}
              name={player.name}
              moveUp={updatePlayerOrder(i, -1)}
              moveDown={updatePlayerOrder(i, 1)}
              onBlur={updateNames(i)}
            />
          ),
      )}
    </Grid>
  );
};

export default EditPlayers;
