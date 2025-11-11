import MissionEntry from "./MissionEntry";
import { useForcedMissions } from "../useImperialAssault";
import { Grid, Typography } from "@mui/material";

const ForcedMissions = () => {
  const { forcedMissions, handleVictoryClick, updateMissionName } =
    useForcedMissions();
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Forced Missions
      </Typography>
      <Grid container alignItems="center" marginBottom={3} spacing={1}>
        {forcedMissions.map((m, i) => (
          <MissionEntry
            key={i}
            mission={m}
            onNameBlur={updateMissionName(i)}
            onVictoryClick={handleVictoryClick(i)}
          />
        ))}
      </Grid>
    </>
  );
};

export default ForcedMissions;
