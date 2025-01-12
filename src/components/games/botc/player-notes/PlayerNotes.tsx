import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { BotCPlayer } from "../../../../jotai/botc-atom";
import CharacterSheet from "./character-sheet/CharacterSheet";
import { usePlayerNotes } from "../useBotC";

interface PlayerNotesProps {
  botcPlayers: BotCPlayer[];
  isText: boolean;
  playerCount: number;
  script: number;
}

const chipStyle = {
  marginRight: "5px",
  marginTop: "5px",
};

const PlayerNotes = ({
  botcPlayers,
  isText,
  playerCount,
  script,
}: PlayerNotesProps) => {
  const { updateNotes, updateRoles, updateStats } = usePlayerNotes();

  return (
    <Grid container spacing={1}>
      {botcPlayers.map(
        (player, i) =>
          i < playerCount && (
            <Grid
              size={{ xs: isText ? 6 : 4, sm: 4, lg: 3, xl: 2 }}
              key={`player${i}-${player.name}`}
            >
              <Card sx={{ padding: "5px", textAlign: "center" }}>
                <CharacterSheet
                  isText={isText}
                  script={script}
                  player={player}
                  onNotesBlur={updateNotes(i)}
                  onRoleClick={updateRoles(i)}
                  onStatsToggle={updateStats(i)}
                />

                <Typography>
                  {player.liar && "😈"}
                  {player.used && "❌"}
                  {player.kill && "💀"}
                  {player.exec && "✋"}
                  {(player.liar || player.exec || player.kill || player.used) &&
                    player.notes &&
                    " - "}
                  {player.notes}
                </Typography>

                {player.roles.map((role) => (
                  <Chip
                    key={role.name}
                    title={role.name}
                    label={isText ? role.name : role.icon}
                    color={role.alignment}
                    onDelete={
                      player.roles.length > 1
                        ? updateRoles(i)(role, true)
                        : undefined
                    }
                    sx={chipStyle}
                  />
                ))}
              </Card>
            </Grid>
          ),
      )}
    </Grid>
  );
};

export default PlayerNotes;
