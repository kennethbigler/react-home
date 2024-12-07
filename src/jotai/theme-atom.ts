import { atomWithStorage } from "jotai/utils";
import { indigo, green, teal } from "@mui/material/colors";
import { Color } from "@mui/material";

export const themes = ["light", "dark"] as const;
export type Themes = (typeof themes)[number];

export interface ThemeState {
  mode: Themes;
  primary: Color;
  secondary: Color;
}

export const darkTheme: ThemeState = {
  mode: themes[1],
  primary: teal,
  secondary: green,
};
export const lightTheme: ThemeState = {
  mode: themes[0],
  primary: indigo,
  secondary: green,
};

// matchMedia checks if that setting matches, then returns true or false
// prefers-color-scheme could be either light or dark, here we check for light
const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

const themeAtom = atomWithStorage(
  "themeAtom",
  prefersLight ? lightTheme : darkTheme,
);

export default themeAtom;
