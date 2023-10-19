import { atom } from "recoil";
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

const themeAtom = atom({
  key: "themeAtom",
  default:
    (JSON.parse(localStorage.getItem("theme-atom") || "null") as ThemeState) ||
    darkTheme,
  effects: [
    ({ onSet }) => {
      onSet((state) => {
        localStorage.setItem("theme-atom", JSON.stringify(state));
      });
    },
  ],
});

export default themeAtom;
