import * as React from "react";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import ArrowRight from "@mui/icons-material/ArrowRight";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { BotCPlayer } from "../../../../jotai/botc-atom";
import CharacterSheet from "./character-sheet/CharacterSheet";
import { usePlayerNotes } from "../useBotC";
import { getGridSize } from "../helpers";

interface PlayerNotesProps {
  botcPlayers: BotCPlayer[];
  isText: boolean;
  playerCount: number;
  script: number;
  showMove: boolean;
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
  showMove,
}: PlayerNotesProps) => {
  const {
    updateNames,
    updateNotes,
    updatePlayerOrder,
    updateRoles,
    updateStats,
  } = usePlayerNotes();

  return (
    <Grid container spacing={1}>
      {botcPlayers.map(
        (player, i) =>
          i < playerCount && (
            <React.Fragment key={`player${i}-${player.name}`}>
              <Grid size={getGridSize(playerCount, i)}>
                <Card sx={{ padding: 1, textAlign: "center", height: "100%" }}>
                  <div className="flex-container">
                    {showMove && (
                      <ButtonGroup
                        aria-label="move player"
                        orientation="vertical"
                        variant="text"
                      >
                        <Button
                          aria-label="up"
                          disabled={i === 0}
                          size="small"
                          onClick={updatePlayerOrder(i, -1)}
                        >
                          <ArrowLeft />
                        </Button>
                        <Button
                          aria-label="down"
                          disabled={i === playerCount - 1}
                          size="small"
                          onClick={updatePlayerOrder(i, 1)}
                        >
                          <ArrowRight />
                        </Button>
                      </ButtonGroup>
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
    </Grid>
  );
};

export default PlayerNotes;
