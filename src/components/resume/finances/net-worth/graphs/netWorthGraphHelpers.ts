import type Highcharts from "highcharts/highcharts.src";
import dateHelper from "../../../../../apis/DateHelper";
import {
  NetWorthCalcEntry,
  NetWorthEntry,
} from "../../../../../jotai/finances-atom";

type NetWorthChartPoint = [number, number];

const entryDateToTimestamp = (entryDate: string): number => {
  const { year, month, day } = dateHelper(entryDate);
  return Date.UTC(year, month, day);
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const inflationKey: { [key: number]: number } = {
  2000: 1.034,
  2001: 1.028,
  2002: 1.016,
  2003: 1.023,
  2004: 1.027,
  2005: 1.034,
  2006: 1.032,
  2007: 1.028,
  2008: 1.038,
  2009: 0.996,
  2010: 1.016,
  2011: 1.032,
  2012: 1.021,
  2013: 1.015,
  2014: 1.016,
  2015: 1.001,
  2016: 1.013,
  2017: 1.021,
  2018: 1.024,
  2019: 1.018,
  2020: 1.012,
  2021: 1.047,
  2022: 1.08,
  2023: 1.041,
  2024: 1.027,
  2025: 1.027,
  2026: 1.021,
};

type TooltipPoint = Pick<Highcharts.Point, "y"> & {
  series: Pick<Highcharts.Series, "color" | "name">;
};

export interface NetWorthTooltipOptions {
  categoryNames: string[];
  finalInflationValue?: number | null;
  hoveredPointIndex?: number;
  selectedPointIndex?: number;
}

const getInflationTooltipValue = (
  point: TooltipPoint,
  {
    finalInflationValue,
    hoveredPointIndex,
    selectedPointIndex,
  }: NetWorthTooltipOptions,
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

export const formatNetWorthTooltip = (
  points: TooltipPoint[],
  options: NetWorthTooltipOptions,
) => {
  const categoryNames = new Set(options.categoryNames);
  const total = points.reduce((sum, point) => {
    return categoryNames.has(point.series.name)
      ? sum + (point.y || 0)
      : sum;
  }, 0);

  const categoryRows = points
    .filter((point) => point.series.name !== "Inflation")
    .map((point) => {
      const value = getInflationTooltipValue(point, options);

      return [
        `<span style="color:${point.series.color?.toString() || "inherit"}">&#9679;</span>`,
        `${point.series.name}: <b>${currencyFormatter.format(value || 0)}</b>`,
      ].join(" ");
    });

  const inflationPoint = points.find(
    (point) => point.series.name === "Inflation",
  );
  const inflationRow = inflationPoint
    ? [
        `<span style="color:${inflationPoint.series.color?.toString() || "inherit"}">&#9679;</span>`,
        `Inflation: <b>${currencyFormatter.format(getInflationTooltipValue(inflationPoint, options) || 0)}</b>`,
      ].join(" ")
    : null;

  return [
    "<b>Net Worth</b>",
    ...categoryRows,
    `&#9679; Total: <b>${currencyFormatter.format(total)}</b>`,
    ...(inflationRow ? [inflationRow] : []),
  ].join("<br/>");
};

export interface NetWorthChartData {
  categorySeries: NetWorthChartPoint[][];
  inflation: NetWorthChartPoint[];
}

export const buildNetWorthChartData = (
  startIdx: number,
  entries: NetWorthEntry[],
  calcEntries: NetWorthCalcEntry[],
  categories: string[],
): NetWorthChartData => {
  const categorySeries: NetWorthChartPoint[][] = categories.map(() => []);
  const inflation: NetWorthChartPoint[] = [];

  if (entries.length === 0) {
    return { categorySeries, inflation };
  }

  const safeStartIdx = Math.min(Math.max(startIdx, 0), entries.length - 1);
  let startYear = dateHelper(entries[safeStartIdx].entryDate).year;
  let startTC = calcEntries[safeStartIdx].total;
  const startIsLastEntry = safeStartIdx === entries.length - 1;

  entries.forEach((entry, i) => {
    const x = entryDateToTimestamp(entry.entryDate);
    const entryTotal = calcEntries[i].total;

    categories.forEach((category, catIdx) => {
      categorySeries[catIdx].push([x, entry.amounts[category] ?? 0]);
    });

    if (startIsLastEntry) {
      inflation.push([x, entryTotal]);
      return;
    }

    const endYear = dateHelper(entry.entryDate).year;
    if (endYear >= startYear) {
      for (; startYear < endYear; startYear += 1) {
        startTC *= inflationKey[startYear] ?? 1;
      }
      inflation.push([x, startTC]);
    } else {
      inflation.push([x, entryTotal]);
    }
  });

  return { categorySeries, inflation };
};
