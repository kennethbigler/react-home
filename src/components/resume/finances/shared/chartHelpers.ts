import type Highcharts from "highcharts/highcharts.src";
import dateHelper from "../../../../apis/DateHelper";
import usDollar from "../../../../apis/usDollar";

/** The subset of a Highcharts point the tooltip formatters rely on. */
export type TooltipPoint = Pick<Highcharts.Point, "y"> & {
  series: Pick<Highcharts.Series, "color" | "name">;
};

export interface InflationTooltipOptions {
  finalInflationValue?: number | null;
  hoveredPointIndex?: number;
  selectedPointIndex?: number;
}

/** Highcharts x-value (UTC ms) for a YYYY-MM entry date. */
export const entryDateToTimestamp = (entryDate: string): number => {
  const { year, month, day } = dateHelper(entryDate);
  return Date.UTC(year, month, day);
};

/** Escape user-editable text before interpolating into Highcharts HTML tooltips. */
const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * Inflation series value for the tooltip: hovering the selected start point
 * shows the projected final value instead of the point's own value.
 */
export const getInflationTooltipValue = (
  point: TooltipPoint,
  {
    finalInflationValue,
    hoveredPointIndex,
    selectedPointIndex,
  }: InflationTooltipOptions,
) => {
  if (point.series.name !== "Inflation") {
    return point.y;
  }

  const showFinalInflation =
    finalInflationValue !== undefined &&
    finalInflationValue !== null &&
    hoveredPointIndex !== undefined &&
    selectedPointIndex !== undefined &&
    hoveredPointIndex === selectedPointIndex;

  return showFinalInflation ? finalInflationValue : point.y;
};

/** Compact currency labels for chart axes (e.g. $500k, $1M, $1.5M). */
export const formatCompactAxisCurrency = (value: number): string => {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  const formatScaled = (scaled: number, suffix: string) => {
    const rounded =
      scaled >= 100
        ? Math.round(scaled).toString()
        : Number.isInteger(scaled)
          ? scaled.toString()
          : scaled.toFixed(1).replace(/\.0$/, "");
    return `${sign}$${rounded}${suffix}`;
  };

  if (abs >= 1_000_000) {
    return formatScaled(abs / 1_000_000, "M");
  }
  if (abs >= 1_000) {
    return formatScaled(abs / 1_000, "k");
  }

  return `${sign}$${Math.round(abs).toLocaleString("en-US")}`;
};

/** One "● Name: <b>$value</b>" tooltip row colored to match its series. */
export const formatTooltipRow = (
  point: TooltipPoint,
  value: number | null | undefined,
) =>
  [
    `<span style="color:${point.series.color?.toString() || "inherit"}">&#9679;</span>`,
    `${escapeHtml(point.series.name)}: <b>${usDollar.format(value || 0)}</b>`,
  ].join(" ");
