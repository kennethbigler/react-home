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
import { TYPE_CHARTS, TYPE_INTRODUCED } from "./pokemon-type-charts";

export interface Types {
  name: string;
  color: string;
  inverted?: boolean;
}

export const types: Types[] = [
  { name: "normal", color: grey[100], inverted: true },
  { name: "fight", color: deepOrange[900] },
  { name: "flying", color: lightBlue[200], inverted: true },
  { name: "poison", color: deepPurple[500] },
  { name: "ground", color: amber[100], inverted: true },
  { name: "rock", color: brown[500] },
  { name: "bug", color: lightGreen[400], inverted: true },
  { name: "ghost", color: deepPurple[800] },
  { name: "steel", color: grey[500], inverted: true },
  { name: "fire", color: red[700] },
  { name: "water", color: blue[700] },
  { name: "grass", color: green[800] },
  { name: "electric", color: yellow[700], inverted: true },
  { name: "psychic", color: pink[700] },
  { name: "ice", color: cyan[800] },
  { name: "dragon", color: indigo.A700 },
  { name: "dark", color: grey[800] },
  { name: "fairy", color: pink[100], inverted: true },
];

export type Effectiveness = 0 | 0.25 | 0.5 | 1 | 2 | 4;

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export const DEFAULT_GENERATION = 3;

const toRoman = (gen: number) => ROMAN[gen - 1] ?? String(gen);

/** one option per distinct chart, e.g. "Generation II–V" */
export const GENERATIONS = TYPE_CHARTS.map(({ from, to }) => ({
  value: from,
  label: `Generation ${toRoman(from)}${from === to ? "" : `–${toRoman(to)}`}`,
}));

/** types and matchup grid that existed in `generation` */
export const getGenerationChart = (generation: number) => {
  const chart =
    TYPE_CHARTS.find((c) => generation >= c.from && generation <= c.to) ??
    TYPE_CHARTS[TYPE_CHARTS.length - 1];
  const kept = types
    .map((_, i) => i)
    .filter((i) => TYPE_INTRODUCED[i] <= chart.to);

  return {
    value: chart.from,
    types: kept.map((i) => types[i]),
    effectiveness: kept.map((i) => kept.map((j) => chart.effectiveness[i][j])),
  };
};
