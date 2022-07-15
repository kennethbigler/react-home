import React from "react";
import { Typography } from "@mui/material";
import { School } from "../../../constants/classes";

const EducationSeg: React.FC<School> = React.memo(
  ({
    degree,
    gpa,
    graduation,
    honors,
    location,
    major,
    minor,
    school,
  }: School) => (
    <div>
      <Typography variant="h4">{`${school || ""}, ${
        location || ""
      }`}</Typography>
      <Typography variant="h5">
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
        {graduation && (
          <li>
            <Typography>{`Completion: ${graduation}`}</Typography>
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
