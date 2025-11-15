import { Typography, Grid } from "@mui/material";
import Job from "./Job";
import { Job as JobType } from "../../../constants/work";

interface WorkCardsProps {
  title: string;
  jobs: JobType[];
}

const WorkCards = ({ title, jobs }: WorkCardsProps) => (
  <div style={{ marginTop: 25 }}>
    <Typography
      variant="h3"
      component="h2"
      style={{ textTransform: "capitalize" }}
    >
      {title}
    </Typography>
    <hr aria-hidden />
    <Grid container spacing={2}>
      {jobs.map((job) => (
        <Job key={job.company} job={job} triple={jobs.length >= 3} />
      ))}
    </Grid>
  </div>
);

export default WorkCards;
