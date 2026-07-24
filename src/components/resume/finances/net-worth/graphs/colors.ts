import {
  blue,
  lightGreen,
  orange,
  purple,
  teal,
  pink,
  indigo,
  amber,
  cyan,
  deepOrange,
} from "@mui/material/colors";

const colors: string[] = [
  lightGreen[500],
  orange[500],
  blue[500],
  purple[500],
  teal[500],
  pink[500],
  indigo[500],
  amber[700],
  cyan[500],
  deepOrange[500],
];

export const getCategoryColor = (index: number): string =>
  colors[index % colors.length];

export default colors;
