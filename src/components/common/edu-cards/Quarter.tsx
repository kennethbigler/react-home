import Class, { ClassProps } from "./Class";
import { Typography } from "@mui/material";

export interface QuarterType {
  classes: ClassProps[];
  quarter: string;
}
interface QuarterProps {
  quarter: QuarterType;
}

/** Degree  -> Year  ->  Quarter  ->  Class */
const Quarter = ({ quarter }: QuarterProps) => (
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
