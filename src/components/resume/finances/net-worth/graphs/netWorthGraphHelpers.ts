import dateHelper from "../../../../../apis/DateHelper";
import usDollar from "../../../../../apis/usDollar";
import type {
  NetWorthCalcEntry,
  NetWorthEntry,
} from "../../../../../jotai/finances-atom";
import {
  entryDateToTimestamp,
  formatTooltipRow,
  getInflationTooltipValue,
  type InflationTooltipOptions,
  type TooltipPoint,
} from "../../shared/chartHelpers";
import { getInflationRate } from "../../shared/inflation";

type NetWorthChartPoint = [number, number];

interface NetWorthTooltipOptions extends InflationTooltipOptions {
  categoryNames: string[];
}

export const formatNetWorthTooltip = (
  points: TooltipPoint[],
  options: NetWorthTooltipOptions,
) => {
  const categoryNames = new Set(options.categoryNames);
  const total = points.reduce(
    (sum, point) =>
      categoryNames.has(point.series.name) ? sum + (point.y || 0) : sum,
    0,
  );

  const categoryRows = points
    .filter((point) => point.series.name !== "Inflation")
    .map((point) => formatTooltipRow(point, point.y));

  const inflationPoint = points.find(
    (point) => point.series.name === "Inflation",
  );

  return [
    "<b>Net Worth</b>",
    ...categoryRows,
    `&#9679; Total: <b>${usDollar.format(total)}</b>`,
    ...(inflationPoint
      ? [
          formatTooltipRow(
            inflationPoint,
            getInflationTooltipValue(inflationPoint, options),
          ),
        ]
      : []),
  ].join("<br/>");
};

interface NetWorthChartData {
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
        startTC *= getInflationRate(startYear);
      }
      inflation.push([x, startTC]);
    } else {
      inflation.push([x, entryTotal]);
    }
  });

  return { categorySeries, inflation };
};
