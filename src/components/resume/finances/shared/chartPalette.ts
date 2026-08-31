import {
  amber,
  blue,
  cyan,
  deepOrange,
  indigo,
  lightGreen,
  orange,
  pink,
  purple,
  teal,
} from "@mui/material/colors";

/** Kept in sync with the budgeting sankey so income streams match. */
export const stockColor = lightGreen[500];
export const bonusColor = orange[500];
export const salaryColor = blue[500];

/**
 * Category palette shared by the net worth charts; the first entries match
 * the income stream colors above.
 */
export const categoryChartColors: string[] = [
  stockColor,
  bonusColor,
  salaryColor,
  purple[500],
  teal[500],
  pink[500],
  indigo[500],
  amber[700],
  cyan[500],
  deepOrange[500],
];

export const getCategoryColor = (index: number): string =>
  categoryChartColors[index % categoryChartColors.length];
