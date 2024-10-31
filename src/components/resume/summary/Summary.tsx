import * as React from "react";
import Typography from "@mui/material/Typography";
import Info from "./Info";
import Education from "./Education";
import Job from "../work/Job";
import workExp from "../../../constants/work";

/* Summary  ->  Info
 *         |->  Skills
 *         |->  Education */
const Summary = React.memo(() => (
  <>
    <Typography variant="h2" component="h1" gutterBottom>
      Summary
    </Typography>
    <Info />
    <Job job={workExp[0]} />
    <Education />
  </>
));

Summary.displayName = "Summary";

export default Summary;
