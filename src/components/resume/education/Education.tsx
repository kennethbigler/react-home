import * as React from "react";
import Typography from "@mui/material/Typography";
import Degree from "./Degree";
import classes from "../../../constants/classes";

/** Education  ->  Degree  -> Year  ->  Quarter  ->  Class */
const Education = React.memo(() => (
  <>
    <Typography variant="h2" component="h1">
      Hackathons &amp; Education
    </Typography>
    {classes.map((d) => (
      <Degree key={d.degree} degree={d} />
    ))}
  </>
));

export default Education;
