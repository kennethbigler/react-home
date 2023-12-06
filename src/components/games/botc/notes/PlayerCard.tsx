import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { BotCPlayer, BotCRole } from "../../../../recoil/botc-atom";
import InfoPopup from "../../../common/info-popover/InfoPopup";
import RoleDialog from "./RoleDialog";

interface PlayerCardProps {
  script: number;
  player: BotCPlayer;
  updateStats: (
    key: "liar" | "dead" | "used",
  ) => (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  updateRoles: (role: BotCRole, selected: boolean) => () => void;
  updateNotes: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const chipStyle = { marginRight: "5px", marginTop: "5px" };

const PlayerCard = ({
  script,
  player,
  updateStats,
  updateRoles,
  updateNotes,
}: PlayerCardProps) => (
  <Grid item xs={6} sm={4} md={3} lg={2} xl={1}>
    <Card sx={{ padding: "5px", textAlign: "center" }}>
      <InfoPopup buttonText={player.name} title={`Roles - ${player.name}`}>
        <RoleDialog
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
