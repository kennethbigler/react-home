import { memo } from "react";
import { Typography } from "@mui/material";
import { work, volunteer } from "@/constants/work";
import WorkCards from "./WorkCards";
import Degree from "@/components/common/edu-cards/Degree";
import classes from "@/constants/classes";

/* Work  ->  WorkCards  ->  Job */
const Work = memo(() => (
  <>
    <Typography variant="h2" component="h1">
      Experience
    </Typography>
    <WorkCards jobs={work} title="Work" />
    <WorkCards jobs={volunteer} title="Volunteer" />
    <div style={{ marginTop: 25 }}>
      <Typography variant="h3" component="h2">
        Education
      </Typography>
      <hr aria-hidden />
      {classes.map((d) => (
        <Degree key={d.degree} degree={d} />
      ))}
    </div>
  </>
));

Work.displayName = "Work";

export default Work;
