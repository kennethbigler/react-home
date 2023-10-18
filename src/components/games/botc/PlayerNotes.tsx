import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PlayerCard from "./PlayerCard";
import { BotCPlayer } from "../../../recoil/botc-atom";
import { playerDist } from "../../../constants/botc";

interface PlayerNotesProps {
  script: number;
  numPlayers: number;
  numTravelers: number;
  botcPlayers: BotCPlayer[];
  updatePlayerStats: (
    i: number,
    key: "liar" | "dead" | "used",
  ) => (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  updatePlayerRoles: (i: number, role: string, selected: boolean) => () => void;
  updatePlayerNotesBlur: (
    i: number,
  ) => (e: React.FocusEvent<HTMLInputElement>) => void;
  updatePlayerNotesKeyDown: (
    i: number,
  ) => (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

const PlayerNotes = ({
  script,
  numPlayers,
  numTravelers,
  botcPlayers,
  updatePlayerStats,
  updatePlayerRoles,
  updatePlayerNotesBlur,
  updatePlayerNotesKeyDown,
}: PlayerNotesProps) => {
  // set player Buttons
  const playerButtons = [];
  for (let i = 0; i < numPlayers; i += 1) {
    playerButtons.push(
      <PlayerCard
        script={script}
        playerNo={i}
        player={botcPlayers[i]}
        updatePlayerStats={updatePlayerStats}
        updatePlayerRoles={updatePlayerRoles}
        updatePlayerNotesBlur={updatePlayerNotesBlur}
        updatePlayerNotesKeyDown={updatePlayerNotesKeyDown}
        key={`playerNo${i}`}
      />,
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography>Dist: {playerDist[numPlayers]} + {numTravelers}</Typography>
      </Grid>
      {playerButtons}
    </Grid>
  );
};

export default PlayerNotes;
