import { useAtomValue } from "jotai";
import themeAtom from "../../../../jotai/theme-atom";

/** Contrast color for Highcharts text against the current app theme. */
const useChartTextColor = (): "black" | "white" => {
  const theme = useAtomValue(themeAtom);
  return theme.mode === "light" ? "black" : "white";
};

export default useChartTextColor;
