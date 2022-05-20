import { createSlice } from "@reduxjs/toolkit";
import { blueGrey, deepOrange, teal } from "@mui/material/colors";
import { Color } from "@mui/material";

export const themes = ["light", "dark"] as const;
export type Themes = typeof themes[number];

export interface ThemeState {
  mode: Themes;
  primary: Color;
  secondary: Color;
}

const initialState: ThemeState = {
  mode: themes[1],
  primary: teal,
  secondary: deepOrange,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    displayDarkTheme: () => ({
      mode: themes[1],
      primary: teal,
      secondary: deepOrange,
    }),
    displayLightTheme: () => ({
      mode: themes[0],
      primary: blueGrey,
      secondary: deepOrange,
    }),
  },
});

// Action creators are generated for each case reducer function
export const { displayDarkTheme, displayLightTheme } = themeSlice.actions;

export default themeSlice.reducer;
