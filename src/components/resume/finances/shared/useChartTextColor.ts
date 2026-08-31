import { createTheme, useTheme } from "@mui/material/styles";
import { useAtomValue } from "jotai";
import themeAtom from "@/jotai/theme-atom";

/** Text color for Highcharts labels against the current app theme. */
const useChartTextColor = (): string => {
  const { palette } = useTheme();
  const appTheme = useAtomValue(themeAtom);

  if (palette.mode === appTheme.mode) {
    return palette.text.primary;
  }

  // Tests may set themeAtom without a matching ThemeProvider.
  return createTheme({ palette: { mode: appTheme.mode } }).palette.text.primary;
};

export default useChartTextColor;
