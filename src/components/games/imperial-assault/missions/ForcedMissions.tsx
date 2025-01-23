import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { getForcedMission } from "../../../../constants/imperial-campaigns";
import MissionEntry from "./MissionEntry";

const ForcedMissions = () => (
  <>
    <Typography variant="h3" gutterBottom>
      Forced Missions
    </Typography>
    <Grid container alignItems="center" marginBottom={3}>
      {/* TODO: figure out how to get threat level (copy most recent victory !==0 threat value) */}
      {[getForcedMission(2), getForcedMission(4)].map((m, i) => (
        <MissionEntry isForced mission={m} key={i} />
      ))}
    </Grid>
  </>
);

export default ForcedMissions;
