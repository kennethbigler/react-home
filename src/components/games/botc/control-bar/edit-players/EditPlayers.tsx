import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Slider from "@mui/material/Slider";
import {
  BotCPlayer,
  BOTC_MAX_PLAYERS,
  BOTC_MAX_TRAVELERS,
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
        <Typography>
          Players: {numPlayers} / Dist: {playerDist[numPlayers]}
        </Typography>
        <Slider
          aria-label="player count"
          min={BOTC_MIN_PLAYERS}
          max={BOTC_MAX_PLAYERS}
          value={numPlayers}
          onChange={updateNumPlayers}
        />
      </Grid>

      <Grid size={12}>
        <Typography>Travelers: {numTravelers}</Typography>
        <Slider
          aria-label="traveler count"
          min={0}
          max={BOTC_MAX_TRAVELERS}
          value={numTravelers}
          onChange={updateNumTravelers}
        />
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
