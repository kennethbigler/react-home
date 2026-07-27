import { blue, lightGreen, orange } from "@mui/material/colors";

/** Kept in sync with the budgeting sankey so income streams match. */
export const stockColor = lightGreen[500];
export const bonusColor = orange[500];
export const salaryColor = blue[500];

/** Series color order matches STOCK / BONUS / SALARY / TOTAL. */
const colors: string[] = [stockColor, bonusColor, salaryColor, orange[900]];

export default colors;
