import * as React from "react";
import Typography from "@mui/material/Typography";
import { School } from "../../../constants/classes";

const EducationSeg: React.FC<School> = React.memo(
  ({ degree, gpa, honors, location, major, minor, school }: School) => (
    <div>
      <Typography variant="h4" component="h2">{`${school || ""}, ${
        location || ""
      }`}</Typography>
      <Typography variant="h5" component="h3">
        {degree + (major ? ` in ${major}` : "")}
      </Typography>
      <ul>
        {minor && (
          <li>
            <Typography>{minor}</Typography>
          </li>
        )}
        {honors && (
          <li>
            <Typography>{honors}</Typography>
          </li>
        )}
        {gpa && (
          <li>
            <Typography>{`GPA: ${gpa}`}</Typography>
          </li>
        )}
      </ul>
    </div>
  )
);

export default EducationSeg;
