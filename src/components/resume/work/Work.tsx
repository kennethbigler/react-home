import * as React from "react";
import Typography from "@mui/material/Typography";
import workExp, { VOLUNTEER, WORK, SCHOOL } from "../../../constants/work";
import WorkCards from "./WorkCards";

/* Work  ->  WorkCards  ->  Job */
const Work = React.memo(() => (
  <>
    <Typography variant="h2" component="h1">
      Experience
    </Typography>
    <WorkCards workExp={workExp} workTypes={[WORK, VOLUNTEER, SCHOOL]} />
  </>
));

Work.displayName = "Work";

export default Work;
