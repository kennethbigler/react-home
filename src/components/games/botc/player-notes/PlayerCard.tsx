import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import {
  BotCPlayer,
  BotCPlayerStatus,
  BotCRole,
} from "../../../../recoil/botc-atom";
import CharacterSheet from "./character-sheet/CharacterSheet";

interface PlayerCardProps {
  isText: boolean;
  player: BotCPlayer;
  script: number;
  updateNotes: (e: React.FocusEvent<HTMLInputElement>) => void;
  updateRoles: (role: BotCRole, selected: boolean) => () => void;
  updateStats: (
    key: BotCPlayerStatus,
  ) => (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

const chipStyle = {
  marginRight: "5px",
  marginTop: "5px",
};

const PlayerCard = ({
  isText,
  player,
  script,
  updateNotes,
  updateRoles,
  updateStats,
}: PlayerCardProps) => (
  <Grid size={{ xs: 6, sm: 4, lg: 3, xl: 2 }}>
    <Card sx={{ padding: "5px", textAlign: "center" }}>
      <CharacterSheet
        isText={isText}
        script={script}
        player={player}
        updateStats={updateStats}
        updateRoles={updateRoles}
        updateNotes={updateNotes}
      />

      <Typography>
        {player.liar && "😈"}
        {player.used && "❌"}
        {player.exec && "💀"}
        {player.kill && "🗡️"}
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
          onDelete={updateRoles(role, true)}
          sx={chipStyle}
        />
      ))}
    </Card>
  </Grid>
);

export default PlayerCard;
