import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { BotCPlayer } from "../../../recoil/botc-atom";
import InfoPopup from "../../common/info-popover/InfoPopup";
import RoleDialog from "./RoleDialog";

interface PlayerCardProps {
  script: number;
  player: BotCPlayer;
}

const PlayerCard = ({ script, player }: PlayerCardProps) => (
  <Grid item xs={6} sm={4} md={3} lg={2} xl={1}>
    <Card sx={{ padding: "5px", textAlign: "center" }}>
      <Typography>
        {player.name} {player.liar && "😈"}
        {player.dead && "💀"}
        {player.used && "❌"}
      </Typography>
      <Typography>
        {player.roles.reduce((acc, role, i) =>
          i !== 0 ? `${acc}, ${role}` : role,
        )}
      </Typography>
      <InfoPopup title="Roles">
        <RoleDialog script={script} player={player} />
      </InfoPopup>
    </Card>
  </Grid>
);

export default PlayerCard;
