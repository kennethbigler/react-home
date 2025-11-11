import { memo } from "react";
import { Typography } from "@mui/material";
import { School } from "../../../constants/classes";

const EducationSeg = memo(
  ({ degree, honors, location, major, minor, school }: School) => (
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
      </ul>
    </div>
  ),
);

EducationSeg.displayName = "EducationSeg";

export default EducationSeg;
