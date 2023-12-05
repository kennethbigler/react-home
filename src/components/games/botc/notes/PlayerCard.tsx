import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { BotCPlayer, BotCRole } from "../../../../recoil/botc-atom";
import InfoPopup from "../../../common/info-popover/InfoPopup";
import RoleDialog from "./RoleDialog";

interface PlayerCardProps {
  script: number;
  playerNo: number;
  player: BotCPlayer;
  updateStats: (
    i: number,
    key: "liar" | "dead" | "used",
  ) => (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  updateRoles: (i: number, role: BotCRole, selected: boolean) => () => void;
  updateNotesOnBlur: (
    i: number,
  ) => (e: React.FocusEvent<HTMLInputElement>) => void;
}

const chipStyle = { marginRight: "5px", marginTop: "5px" };

const PlayerCard = ({
  script,
  playerNo,
  player,
  updateStats,
  updateRoles,
  updateNotesOnBlur,
}: PlayerCardProps) => (
  <Grid item xs={6} sm={4} md={3} lg={2} xl={1}>
    <Card sx={{ padding: "5px", textAlign: "center" }}>
      <InfoPopup buttonText={player.name} title={`Roles - ${player.name}`}>
        <RoleDialog
          script={script}
          playerNo={playerNo}
          player={player}
          updateStats={updateStats}
          updateRoles={updateRoles}
          updateNotesOnBlur={updateNotesOnBlur}
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
          onDelete={updateRoles(playerNo, role, true)}
          sx={chipStyle}
        />
      ))}
    </Card>
  </Grid>
);

export default PlayerCard;
