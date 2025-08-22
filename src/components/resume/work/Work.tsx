import * as React from "react";
import Typography from "@mui/material/Typography";
import { work, volunteer, school } from "../../../constants/work";
import WorkCards from "./WorkCards";

/* Work  ->  WorkCards  ->  Job */
const Work = React.memo(() => (
  <>
    <Typography variant="h2" component="h1">
      Experience
    </Typography>
    <WorkCards jobs={work} title="Work" />
    <WorkCards jobs={volunteer} title="Volunteer" />
    <WorkCards jobs={school} title="School" />
  </>
));

Work.displayName = "Work";

export default Work;
