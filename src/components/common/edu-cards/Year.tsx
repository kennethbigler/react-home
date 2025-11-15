import Quarter, { QuarterType } from "./Quarter";
import { Grid, Typography } from "@mui/material";

export interface YearType {
  year: string;
  quarters: QuarterType[];
}
interface YearProps {
  len: number;
  year: YearType;
}

/** Degree  -> Year  ->  Quarter  ->  Class */
const Year = ({ year, len }: YearProps) => (
  <Grid
    size={{
      xs: 12,
      md: len > 1 ? 6 : 12,
      lg: Math.max(Math.ceil(12 / len), 3),
    }}
  >
    <Typography variant="h4" component="h2">
      {year.year}
    </Typography>
    <hr aria-hidden />
    {year.quarters.map((quarter, i) => (
      <Quarter key={`${quarter.quarter}-${i}`} quarter={quarter} />
    ))}
  </Grid>
);

export default Year;
