import { memo } from "react";
import { Typography } from "@mui/material";
import Degree from "../../common/edu-cards/Degree";
import classes from "../../../constants/classes";

/** Education  ->  Degree  -> Year  ->  Quarter  ->  Class */
const Education = memo(() => (
  <>
    <Typography variant="h2" component="h1">
      Education
    </Typography>
    {classes.map((d) => (
      <Degree key={d.degree} degree={d} />
    ))}
  </>
));

Education.displayName = "Education";

export default Education;
