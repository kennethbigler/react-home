import persistentAtom from "./storage";
import { indigo, green, teal } from "@mui/material/colors";
import type { Color } from "@mui/material";

const themes = ["light", "dark"] as const;
type Themes = (typeof themes)[number];

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

// prefers-color-scheme could be either light or dark, here we check for light;
// matchMedia is optional-chained for non-DOM environments (tests, SSR tooling)
const prefersLight =
  globalThis.matchMedia?.("(prefers-color-scheme: light)").matches ?? false;

const themeAtom = persistentAtom(
  "themeAtom",
  prefersLight ? lightTheme : darkTheme,
);

export default themeAtom;
