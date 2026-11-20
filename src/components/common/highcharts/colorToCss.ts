import type Highcharts from "highcharts/highcharts.src";

/**
 * Highcharts colors may be gradient/pattern objects; only plain strings are
 * valid CSS for inline tooltip HTML. Falls back to `inherit`.
 */
export const colorToCss = (color: Highcharts.ColorType | undefined): string =>
  typeof color === "string" ? color : "inherit";
