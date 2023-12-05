import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PlayerCard from "./PlayerCard";
import { BotCPlayer, BotCRole } from "../../../../recoil/botc-atom";
import { playerDist } from "../../../../constants/botc";

interface PlayerNotesProps {
  script: number;
  numPlayers: number;
  numTravelers: number;
  botcPlayers: BotCPlayer[];
  updateStats: (
    i: number,
    key: "liar" | "dead" | "used",
  ) => (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  updateRoles: (i: number, role: BotCRole, selected: boolean) => () => void;
  updateNotesOnBlur: (
    i: number,
  ) => (e: React.FocusEvent<HTMLInputElement>) => void;
}

const PlayerNotes = ({
  script,
  numPlayers,
  numTravelers,
  botcPlayers,
  updateStats,
  updateRoles,
  updateNotesOnBlur,
}: PlayerNotesProps) => {
  // set player Buttons
  const playerButtons = [];
  for (let i = 0; i < numPlayers + numTravelers; i += 1) {
    playerButtons.push(
      <PlayerCard
        script={script}
        playerNo={i}
        player={botcPlayers[i]}
        updateStats={updateStats}
        updateRoles={updateRoles}
        updateNotesOnBlur={updateNotesOnBlur}
        key={`playerNo${i}`}
      />,
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography>
          Dist: {playerDist[numPlayers]}
          {numTravelers ? ` +${numTravelers}` : ""}
        </Typography>
      </Grid>
      {playerButtons}
    </Grid>
  );
};

export default PlayerNotes;
