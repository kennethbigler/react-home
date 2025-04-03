import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import MissionEntry from "./MissionEntry";
import { useForcedMissions } from "../useImperialAssault";

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
