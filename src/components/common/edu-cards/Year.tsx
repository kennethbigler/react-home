import * as React from "react";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Quarter, { QuarterType } from "./Quarter";

export interface YearType {
  year: string;
  quarters: QuarterType[];
}
interface YearProps {
  len: number;
  year: YearType;
}

/** Degree  -> Year  ->  Quarter  ->  Class */
const Year: React.FC<YearProps> = ({ year, len }: YearProps) => (
  <Grid size={{ xs: 12, md: Math.ceil(12 / len) }}>
    <Typography variant="h4" component="h2">
      {year.year}
    </Typography>
    <hr />
    {year.quarters.map((quarter, i) => (
      <Quarter key={`${quarter.quarter}-${i}`} quarter={quarter} />
    ))}
  </Grid>
);

export default Year;
