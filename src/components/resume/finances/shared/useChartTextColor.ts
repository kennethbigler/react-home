import { useTheme } from "@mui/material/styles";
import { useAtomValue } from "jotai";
import themeAtom from "../../../../jotai/theme-atom";

/** Contrast color for Highcharts text against the current app theme. */
const useChartTextColor = (): "black" | "white" => {
  const { palette } = useTheme();
  const appTheme = useAtomValue(themeAtom);
  // WithTheme keeps MUI palette.mode in sync with themeAtom; tests may only
  // set the atom without a matching ThemeProvider.
  const mode = palette.mode === appTheme.mode ? palette.mode : appTheme.mode;
  return mode === "dark" ? "white" : "black";
};

export default useChartTextColor;
