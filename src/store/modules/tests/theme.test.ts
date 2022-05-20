import { blueGrey, deepOrange, teal } from "@mui/material/colors";
import themeReducer, {
  displayDarkTheme,
  displayLightTheme,
  ThemeState,
} from "../theme";

const darkState: ThemeState = {
  mode: "dark",
  primary: teal,
  secondary: deepOrange,
};
const lightState: ThemeState = {
  mode: "light",
  primary: blueGrey,
  secondary: deepOrange,
};

describe("store | modules | theme", () => {
  test("reducer", () => {
    expect(themeReducer(lightState, displayDarkTheme())).toEqual(darkState);
    expect(themeReducer(darkState, displayLightTheme())).toEqual(lightState);
    expect(themeReducer(lightState, displayLightTheme())).toEqual(lightState);
    expect(themeReducer(darkState, displayDarkTheme())).toEqual(darkState);
  });

  test("incorrect parameters", () => {
    // @ts-expect-error: fake action for testing purposes
    expect(themeReducer(lightState, { mode: undefined })).toEqual(lightState);
    // @ts-expect-error: fake action for testing purposes
    expect(themeReducer(undefined, { mode: undefined })).toEqual(darkState);
  });
});
