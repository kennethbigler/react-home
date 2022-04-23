import { Action } from "redux";
import { blueGrey, deepOrange, teal } from "@mui/material/colors";
import { DBUITheme } from "../types";
import initialState from "../initialState";

// --------------------     Actions     -------------------- //
enum TA {
  DARK_THEME = "@resume/theme/DARK_THEME",
  LIGHT_THEME = "@resume/theme/LIGHT_THEME",
}
const { DARK_THEME, LIGHT_THEME } = TA;

// --------------------     Action Creators     -------------------- //
/** update to dark theme in Theme DB */
export const displayDarkTheme = (): Action<typeof DARK_THEME> => ({
  type: DARK_THEME,
});
/** update to light theme in Theme DB */
export const displayLightTheme = (): Action<typeof LIGHT_THEME> => ({
  type: LIGHT_THEME,
});

// --------------------     Reducers     -------------------- //
export default function reducer(
  state: DBUITheme = initialState.theme,
  action: Action<TA>
): DBUITheme {
  switch (action.type) {
    case DARK_THEME:
      return {
        ...state,
        ...{ mode: "dark", primary: teal, secondary: deepOrange },
      };
    case LIGHT_THEME:
      return {
        ...state,
        ...{ mode: "light", primary: blueGrey, secondary: deepOrange },
      };
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
