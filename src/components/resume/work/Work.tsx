import { memo } from "react";
import { Typography } from "@mui/material";
import { work, volunteer } from "@/constants/work";
import WorkCards from "./WorkCards";
import DegreeCards from "./DegreeCards";
import classes, { presentations, hackathons } from "@/constants/classes";

/* Work  ->  WorkCards  ->  Job
 *      |->  DegreeCards  ->  Degree */
const Work = memo(() => (
  <>
    <Typography variant="h2" component="h1">
      Experience
    </Typography>
    <DegreeCards title="Presentations" degrees={presentations} fullWidth />
    <WorkCards jobs={work} title="Work" />
    <DegreeCards title="Hackathons" degrees={hackathons} />
    <DegreeCards title="Education" degrees={classes} fullWidth />
    <WorkCards jobs={volunteer} title="Volunteer" />
  </>
));

Work.displayName = "Work";

export default Work;
