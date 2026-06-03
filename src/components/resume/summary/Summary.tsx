import { memo } from "react";
import { Typography, Grid } from "@mui/material";
import Info from "./Info";
import Education from "./Education";
import Job from "../work/Job";
import { summaryJob } from "../../../constants/summary";

/* Summary  ->  Info
 *         |->  Skills
 *         |->  Education */
const Summary = memo(() => (
  <>
    <Typography variant="h2" component="h1" gutterBottom>
      Summary
    </Typography>
    <Info />
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Job job={summaryJob} fullWidth />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Education />
      </Grid>
    </Grid>
  </>
));

Summary.displayName = "Summary";

export default Summary;
