import Grid from "@mui/material/Grid";
import PlayerCard from "./PlayerCard";
import { BotCPlayer } from "../../../recoil/botc-atom";

interface PlayerNotesProps {
  script: number;
  numPlayers: number;
  botcPlayers: BotCPlayer[];
}

const PlayerNotes = ({ script, numPlayers, botcPlayers }: PlayerNotesProps) => {
  // set player Buttons
  const playerButtons = [];
  for (let i = 0; i < numPlayers; i += 1) {
    playerButtons.push(
      <PlayerCard
        script={script}
        player={botcPlayers[i]}
        key={`playerNo${i}`}
      />,
    );
  }

  return (
    <Grid container spacing={2}>
      {playerButtons}
    </Grid>
  );
};

export default PlayerNotes;
