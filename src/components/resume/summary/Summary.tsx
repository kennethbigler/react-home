import * as React from "react";
import Typography from "@mui/material/Typography";
import Info from "./Info";
import Education from "./Education";
import Job from "../work/Job";
import workExp from "../../../constants/work";
import Grid from "@mui/material/Grid";

/* Summary  ->  Info
 *         |->  Skills
 *         |->  Education */
const Summary = React.memo(() => (
  <>
    <Typography variant="h2" component="h1" gutterBottom>
      Summary
    </Typography>
    <Info />
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Job job={workExp[0]} />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Education />
      </Grid>
    </Grid>
  </>
));

Summary.displayName = "Summary";

export default Summary;
