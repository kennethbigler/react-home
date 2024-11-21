import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import {
  BotCPlayer,
  BotCPlayerStatus,
  BotCRole,
} from "../../../../recoil/botc-atom";
import CharacterSheet from "./character-sheet/CharacterSheet";

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

const chipStyle = {
  marginRight: "5px",
  marginTop: "5px",
};

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
    {botcPlayers.map((player, i) =>
      i < numPlayers + numTravelers ? (
        <Grid
          size={{ xs: 6, sm: 4, lg: 3, xl: 2 }}
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
                onDelete={updateRoles(i)(role, true)}
                sx={chipStyle}
              />
            ))}
          </Card>
        </Grid>
      ) : null,
    )}
  </Grid>
);

export default PlayerNotes;
