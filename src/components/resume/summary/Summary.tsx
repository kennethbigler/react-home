import React from "react";
import Typography from "@mui/material/Typography";
import Info from "./Info";
import Skills from "./Skills";
import Education from "./Education";
import TimelineCard from "../../common/timeline-card";

/* Summary  ->  Info
 *         |->  Skills
 *         |->  Education */
const Summary = React.memo(() => (
  <>
    <Typography variant="h1" gutterBottom>
      Summary
    </Typography>
    <Info />
    <TimelineCard />
    <Skills />
    <Education />
  </>
));

export default Summary;
