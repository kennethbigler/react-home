import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import PlayerCard from "./PlayerCard";
import {
  BotCPlayer,
  BotCPlayerStatus,
  BotCRole,
} from "../../../../recoil/botc-atom";
import { playerDist } from "../../../../constants/botc";

interface PlayerNotesProps {
  botcPlayers: BotCPlayer[];
  isText: boolean;
  numPlayers: number;
  numTravelers: number;
  script: number;
  updateNotes: (i: number) => (e: React.FocusEvent<HTMLInputElement>) => void;
  updateRoles: (i: number) => (role: BotCRole, selected: boolean) => () => void;
  updateStats: (
    i: number,
  ) => (
    key: BotCPlayerStatus,
  ) => (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

const PlayerNotes = ({
  botcPlayers,
  isText,
  numPlayers,
  numTravelers,
  script,
  updateNotes,
  updateRoles,
  updateStats,
}: PlayerNotesProps) => (
  <Grid container spacing={2}>
    <Grid size={12}>
      <Typography>
        Dist: {playerDist[numPlayers]}
        {numTravelers ? ` +${numTravelers}` : ""}
      </Typography>
    </Grid>

    {botcPlayers.map((player, i) =>
      i < numPlayers + numTravelers ? (
        <PlayerCard
          key={`player${i}-${player.name}`}
          isText={isText}
          player={player}
          script={script}
          updateNotes={updateNotes(i)}
          updateRoles={updateRoles(i)}
          updateStats={updateStats(i)}
        />
      ) : null,
    )}
  </Grid>
);

export default PlayerNotes;
