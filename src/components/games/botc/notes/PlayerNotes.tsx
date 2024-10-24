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
  isText: boolean;
  script: number;
  numPlayers: number;
  numTravelers: number;
  botcPlayers: BotCPlayer[];
  updateStats: (
    i: number,
  ) => (
    key: BotCPlayerStatus,
  ) => (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  updateRoles: (i: number) => (role: BotCRole, selected: boolean) => () => void;
  updateNotes: (i: number) => (e: React.FocusEvent<HTMLInputElement>) => void;
}

const PlayerNotes = ({
  isText,
  script,
  numPlayers,
  numTravelers,
  botcPlayers,
  updateStats,
  updateRoles,
  updateNotes,
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
          isText={isText}
          key={`player${i}-${player.name}`}
          script={script}
          player={player}
          updateStats={updateStats(i)}
          updateRoles={updateRoles(i)}
          updateNotes={updateNotes(i)}
        />
      ) : null,
    )}
  </Grid>
);

export default PlayerNotes;
