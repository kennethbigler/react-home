import {
  amber,
  blue,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  pink,
  red,
  yellow,
} from "@mui/material/colors";

export interface Types {
  name: string;
  color: string;
  inverted?: boolean;
}

export const types = [
  { name: "normal", color: grey[100], inverted: true },
  { name: "fight", color: deepOrange[900] },
  { name: "flying", color: lightBlue[200], inverted: true },
  { name: "poison", color: deepPurple[500] },
  { name: "ground", color: amber[100], inverted: true },
  { name: "rock", color: brown[500] },
  { name: "bug", color: lightGreen[400], inverted: true },
  { name: "ghost", color: deepPurple[800] },
  { name: "steel", color: grey[500], inverted: true },
  { name: "fire", color: red[500] },
  { name: "water", color: blue[500] },
  { name: "grass", color: green[500] },
  { name: "electric", color: yellow[600], inverted: true },
  { name: "psychic", color: pink[300] },
  { name: "ice", color: cyan[500] },
  { name: "dragon", color: indigo.A700 },
  { name: "dark", color: grey[800] },
  { name: "fairy", color: pink[100], inverted: true },
];

export type Effectiveness = 0 | 0.5 | 1 | 2;

export const effectiveness: Effectiveness[][] = [
  // normal
  [1, 1, 1, 1, 1, 0.5, 1, 0, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  // fight
  [2, 1, 0.5, 0.5, 1, 2, 0.5, 0, 2, 1, 1, 1, 1, 0.5, 2, 1, 2, 0.5],
  // flying
  [1, 2, 1, 1, 1, 0.5, 2, 1, 0.5, 1, 1, 2, 0.5, 1, 1, 1, 1, 1],
  // poison
  [1, 1, 1, 0.5, 0.5, 0.5, 1, 0.5, 0, 1, 1, 2, 1, 1, 1, 1, 1, 2],
  // ground
  [1, 1, 0, 2, 1, 2, 0.5, 1, 2, 2, 1, 0.5, 2, 1, 1, 1, 1, 1],
  // rock
  [1, 0.5, 2, 1, 0.5, 1, 2, 1, 0.5, 2, 1, 1, 1, 1, 2, 1, 1, 1],
  // bug
  [1, 0.5, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 0.5, 1, 2, 1, 2, 1, 1, 0.5, 1],
  // ghost
  [0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 1],
  // steel
  [1, 1, 1, 1, 1, 2, 1, 1, 0.5, 0.5, 0.5, 1, 0.5, 1, 2, 1, 1, 2],
  // fire
  [1, 1, 1, 1, 1, 0.5, 2, 1, 2, 0.5, 0.5, 2, 1, 1, 2, 0.5, 1, 1],
  // water
  [1, 1, 1, 1, 2, 2, 1, 1, 1, 2, 0.5, 0.5, 1, 1, 1, 0.5, 1, 1],
  // grass
  [1, 1, 0.5, 0.5, 2, 2, 0.5, 1, 0.5, 0.5, 2, 0.5, 1, 1, 1, 0.5, 1, 1],
  // electric
  [1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 2, 0.5, 0.5, 1, 1, 0.5, 1, 1],
  // psychic
  [1, 2, 1, 2, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 0.5, 0.5, 1, 0, 1],
  // ice
  [1, 1, 2, 1, 2, 1, 1, 1, 0.5, 0.5, 0.5, 2, 1, 1, 0.5, 2, 1, 1],
  // dragon
  [1, 1, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1, 2, 1, 0],
  // dark
  [1, 0.5, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 0.5],
  // fairy
  [1, 2, 1, 0.5, 1, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 2, 2, 1],
];
