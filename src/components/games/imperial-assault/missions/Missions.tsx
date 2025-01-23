import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { basic } from "../../../../constants/imperial-campaigns";
import MissionEntry from "./MissionEntry";

const Missions = () => (
  <>
    <Typography variant="h3" gutterBottom>
      Missions
    </Typography>
    <Grid container alignItems="center" marginBottom={3} spacing={1}>
      {basic.map((m, i) => (
        <MissionEntry mission={m} isForced={i >= basic.length - 1} key={i} />
      ))}
    </Grid>
  </>
);

export default Missions;
