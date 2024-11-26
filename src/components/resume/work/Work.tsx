import * as React from "react";
import Typography from "@mui/material/Typography";
import TimelineCard from "../../common/timeline-card";
import workExp, { timelineExp, VOLUNTEER, WORK } from "../../../constants/work";
import WorkCards from "./WorkCards";

/* Work  ->  WorkCards  ->  Job */
const Work = React.memo(() => (
  <>
    <Typography variant="h2" component="h1">
      Experience
    </Typography>
    <TimelineCard
      data={timelineExp}
      title="Work Timeline"
      yearMarkerFrequency={2}
    />
    <WorkCards workExp={workExp} workTypes={[WORK, VOLUNTEER]} />
  </>
));

Work.displayName = "Work";

export default Work;
