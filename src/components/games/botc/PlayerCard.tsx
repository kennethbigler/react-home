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
  updatePlayerNotesBlur: (
    i: number,
  ) => (e: React.FocusEvent<HTMLInputElement>) => void;
  updatePlayerNotesKeyDown: (
    i: number,
  ) => (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

const PlayerCard = ({
  script,
  playerNo,
  player,
  updatePlayerStats,
  updatePlayerRoles,
  updatePlayerNotesBlur,
  updatePlayerNotesKeyDown,
}: PlayerCardProps) => (
  <Grid item xs={6} sm={4} md={3} lg={2} xl={1}>
    <Card sx={{ padding: "5px", textAlign: "center" }}>
      <InfoPopup
        buttonColor={player.alignment}
        buttonText={player.name}
        title={`Roles - ${player.name}`}
      >
        <RoleDialog
          script={script}
          playerNo={playerNo}
          player={player}
          updatePlayerStats={updatePlayerStats}
          updatePlayerRoles={updatePlayerRoles}
          updatePlayerNotesBlur={updatePlayerNotesBlur}
          updatePlayerNotesKeyDown={updatePlayerNotesKeyDown}
        />
      </InfoPopup>
      <Typography>
        {player.liar && "😈"}
        {player.dead && "💀"}
        {player.used && "❌"}
        {(player.liar || player.dead || player.used) && player.notes && " - "}
        {player.notes}
      </Typography>
      <Typography>
        {player.roles.reduce(
          (acc, role, i) => (i !== 0 ? `${acc}, ${role}` : role),
          "",
        )}
      </Typography>
    </Card>
  </Grid>
);

export default PlayerCard;
