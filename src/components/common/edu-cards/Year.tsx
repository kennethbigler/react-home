import Grid from "@mui/material/Grid";
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
const Year = ({ year, len }: YearProps) => (
  <Grid
    size={{
      xs: 12,
      md: len > 1 ? 6 : 12,
      lg: Math.max(Math.ceil(12 / len), 3),
      // @ts-expect-error - custom breakpoints
      xxl: Math.max(Math.ceil(12 / len), 2),
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
