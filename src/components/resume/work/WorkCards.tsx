import { Grid } from "@mui/material";
import Job from "./Job";
import type { Job as JobType } from "@/constants/work";
import { ExperienceSection } from "./ExperienceSection";

interface WorkCardsProps {
  title: string;
  jobs: JobType[];
}

const WorkCards = ({ title, jobs }: WorkCardsProps) => (
  <ExperienceSection title={title}>
    <Grid container spacing={2}>
      {jobs.map((job) => (
        <Job key={job.company} job={job} count={jobs.length} />
      ))}
    </Grid>
  </ExperienceSection>
);

export default WorkCards;
