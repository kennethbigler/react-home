import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import SwapHoriz from "@mui/icons-material/SwapHoriz";
import Switch from "@mui/material/Switch";
import { BotCPlayer } from "../../../../jotai/botc-atom";
import CharacterSheet from "./character-sheet/CharacterSheet";
import { usePlayerNotes } from "../useBotC";
import { getGridSize } from "../botcHelpers";
import PlayerAdjControls from "./PlayerAdjControls";

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

const cardStyle = {
  padding: 1,
  textAlign: "center",
  height: "100%",
};

const PlayerNotes = ({
  botcPlayers,
  isText,
  playerCount,
  script,
}: PlayerNotesProps) => {
  const [showMove, setShowMove] = React.useState(false);

  const {
    getRandomPlayer,
    randomPlayer,
    updateNames,
    updateNotes,
    updateRoles,
    updateStats,
  } = usePlayerNotes();

  const handleMoveToggle = () => setShowMove(!showMove);

  return (
    <Grid container spacing={1}>
      {botcPlayers.map(
        (player, i) =>
          i < playerCount && (
            <React.Fragment key={`player${i}-${player.name}`}>
              <Grid size={getGridSize(playerCount, i)}>
                <Card
                  sx={{
                    ...cardStyle,
                    border: randomPlayer === i ? "3px solid red" : "none",
                  }}
                >
                  <div className="flex-container">
                    {showMove && (
                      <PlayerAdjControls i={i} count={playerCount} />
                    )}
                    <CharacterSheet
                      isText={isText}
                      script={script}
                      player={player}
                      onNameBlur={updateNames(i)}
                      onNotesBlur={updateNotes(i)}
                      onRoleClick={updateRoles(i)}
                      onStatsToggle={updateStats(i)}
                    />
                  </div>

                  <Typography>
                    {player.liar && "😈"}
                    {player.used && "❌"}
                    {player.kill && "💀"}
                    {player.exec && "✋"}
                    {(player.liar ||
                      player.exec ||
                      player.kill ||
                      player.used) &&
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
                      variant="outlined"
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
              {i % 2 === 1 && i >= 3 && i < playerCount - 3 && (
                <Grid size={2} />
              )}
            </React.Fragment>
          ),
      )}
      <div
        className="flex-container"
        style={{ marginTop: 15, marginBottom: 30 }}
      >
        <FormControlLabel
          control={<Switch checked={showMove} onChange={handleMoveToggle} />}
          label={<SwapHoriz titleAccess="move players" />}
        />
        <Button
          fullWidth
          color="error"
          variant="outlined"
          onClick={getRandomPlayer}
        >
          Random 🔪
        </Button>
      </div>
    </Grid>
  );
};

export default PlayerNotes;
