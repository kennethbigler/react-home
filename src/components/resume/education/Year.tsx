import React from "react";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import Quarter, { QuarterType } from "./Quarter";

type GridSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export interface YearType {
  year: string;
  quarters: QuarterType[];
}
interface YearProps {
  len: number;
  year: YearType;
}

/** Education  ->  Degree  -> Year  ->  Quarter  ->  Class */
const Year: React.FC<YearProps> = ({ year, len }: YearProps) => (
  <Grid item md={Math.ceil(12 / len) as GridSize} xs={12}>
    <Typography variant="h4">{year.year}</Typography>
    <hr />
    {year.quarters.map((quarter) => (
      <Quarter key={quarter.quarter} quarter={quarter} />
    ))}
  </Grid>
);

export default Year;
