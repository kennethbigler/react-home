import * as React from "react";
import Typography from "@mui/material/Typography";
import Class, { ClassProps } from "./Class";

export interface QuarterType {
  classes: ClassProps[];
  quarter: string;
}
interface QuarterProps {
  quarter: QuarterType;
}

/** Degree  -> Year  ->  Quarter  ->  Class */
const Quarter: React.FC<QuarterProps> = ({ quarter }: QuarterProps) => (
  <>
    <Typography variant="h5" component="h3">
      {quarter.quarter}
    </Typography>
    <ul>
      {quarter.classes.map((c) => (
        <Class key={c.name} name={c.name} catalog={c.catalog} />
      ))}
    </ul>
  </>
);

export default Quarter;
