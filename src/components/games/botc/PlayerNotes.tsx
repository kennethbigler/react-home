import Grid from "@mui/material/Grid";
import PlayerCard from "./PlayerCard";
import { BotCPlayer } from "../../../recoil/botc-atom";

interface PlayerNotesProps {
  script: number;
  numPlayers: number;
  botcPlayers: BotCPlayer[];
  updatePlayerStats: (
    i: number,
    key: "liar" | "dead" | "used",
  ) => (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  updatePlayerRoles: (i: number, role: string, selected: boolean) => () => void;
}

const PlayerNotes = ({
  script,
  numPlayers,
  botcPlayers,
  updatePlayerStats,
  updatePlayerRoles,
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
