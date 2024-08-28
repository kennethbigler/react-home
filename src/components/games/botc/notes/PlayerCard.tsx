import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import {
  BotCPlayer,
  BotCPlayerStatus,
  BotCRole,
} from "../../../../recoil/botc-atom";
import InfoPopup from "../../../common/info-popover/InfoPopup";
import CharacterSheet from "../character-sheet/CharacterSheet";

interface PlayerCardProps {
  script: number;
  player: BotCPlayer;
  updateStats: (
    key: BotCPlayerStatus,
  ) => (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  updateRoles: (role: BotCRole, selected: boolean) => () => void;
  updateNotes: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const chipStyle = {
  marginRight: "5px",
  marginTop: "5px",
};

const PlayerCard = ({
  script,
  player,
  updateStats,
  updateRoles,
  updateNotes,
}: PlayerCardProps) => (
  <Grid size={{ xs: 6, sm: 4, lg: 3, xl: 2 }}>
    <Card sx={{ padding: "5px", textAlign: "center" }}>
      <InfoPopup buttonText={player.name} title={`Roles - ${player.name}`}>
        <CharacterSheet
          script={script}
          player={player}
          updateStats={updateStats}
          updateRoles={updateRoles}
          updateNotes={updateNotes}
        />
      </InfoPopup>
      <Typography>
        {player.liar && "😈"}
        {player.dead && "💀"}
        {player.used && "❌"}
        {(player.liar || player.dead || player.used) && player.notes && " - "}
        {player.notes}
      </Typography>
      {player.roles.map((role) => (
        <Chip
          key={role.name}
          label={role.name}
          color={role.alignment}
          onDelete={updateRoles(role, true)}
          sx={chipStyle}
        />
      ))}
    </Card>
  </Grid>
);

export default PlayerCard;
