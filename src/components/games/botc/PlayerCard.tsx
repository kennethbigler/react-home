import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { BotCPlayer } from "../../../recoil/botc-atom";
import InfoPopup from "../../common/info-popover/InfoPopup";
import RoleDialog from "./RoleDialog";

interface PlayerCardProps {
  script: number;
  playerNo: number;
  player: BotCPlayer;
  updatePlayerStats: (
    i: number,
    key: "liar" | "dead" | "used",
  ) => (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  updatePlayerRoles: (i: number, role: string, selected: boolean) => () => void;
}

const PlayerCard = ({
  script,
  playerNo,
  player,
  updatePlayerStats,
  updatePlayerRoles,
}: PlayerCardProps) => (
  <Grid item xs={6} sm={4} md={3} lg={2} xl={1}>
    <Card sx={{ padding: "5px", textAlign: "center" }}>
      <Typography>
        {player.name} {player.liar && "😈"}
        {player.dead && "💀"}
        {player.used && "❌"}
      </Typography>
      <Typography>
        {player.roles.reduce(
          (acc, role, i) => (i !== 0 ? `${acc}, ${role}` : role),
          "",
        )}
      </Typography>
      <InfoPopup title="Roles">
        <RoleDialog
          script={script}
          playerNo={playerNo}
          player={player}
          updatePlayerStats={updatePlayerStats}
          updatePlayerRoles={updatePlayerRoles}
        />
      </InfoPopup>
    </Card>
  </Grid>
);

export default PlayerCard;
