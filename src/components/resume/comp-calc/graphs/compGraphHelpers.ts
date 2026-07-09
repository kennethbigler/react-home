import type Highcharts from "highcharts/highcharts.src";
import dateHelper from "../../../../apis/DateHelper";
import {
  CompCalcEntry,
  CompEntry,
} from "../../../../jotai/comp-calculator-atom";

export const STOCK = 0;
export const BONUS = 1;
export const SALARY = 2;
export const TOTAL = 3;
export const INFL = 4;

export type CompChartPoint = [number, number];

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

export interface CompTooltipOptions {
  finalInflationValue?: number | null;
  hoveredPointIndex?: number;
  selectedPointIndex?: number;
}

const stackedSeriesNames = new Set(["Stock", "Bonus", "Salary"]);

const getInflationTooltipValue = (
  point: TooltipPoint,
  {
    finalInflationValue,
    hoveredPointIndex,
    selectedPointIndex,
  }: CompTooltipOptions,
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

export const formatCompTooltip = (
  points: TooltipPoint[],
  options: CompTooltipOptions = {},
) => {
  const adjustedTotal = points.reduce((total, point) => {
    return stackedSeriesNames.has(point.series.name)
      ? total + (point.y || 0)
      : total;
  }, 0);

  const rows = points.map((point) => {
    const value = getInflationTooltipValue(point, options);

    return [
      `<span style="color:${point.series.color?.toString() || "inherit"}">&#9679;</span>`,
      `${point.series.name}: <b>${currencyFormatter.format(value || 0)}</b>`,
    ].join(" ");
  });

  return [
    "<b>Compensation</b>",
    ...rows,
    `&#9679; *Total: <b>${currencyFormatter.format(adjustedTotal)}</b>`,
  ].join("<br/>");
};

export const buildCompChartData = (
  startIdx: number,
  compCalcEntries: CompCalcEntry[],
  compEntries: CompEntry[],
): CompChartPoint[][] => {
  const chartData: CompChartPoint[][] = [[], [], [], [], []];
  if (compEntries.length > 0) {
    // set start basis for inflation calculation
    let startYear = dateHelper(compEntries[startIdx].entryDate).year;
    let startTC =
      compEntries[startIdx].salary +
      compEntries[startIdx].bonus +
      (compCalcEntries[startIdx].stockAdj || compCalcEntries[startIdx].stock);
    const startIsLastEntry = startIdx === compEntries.length - 1;

    compEntries.forEach(({ bonus, salary, entryDate }, i) => {
      const { stock, stockAdj } = compCalcEntries[i];
      const total = stock + bonus + salary;
      const x = entryDateToTimestamp(entryDate);
      chartData[STOCK].push([x, stockAdj || stock]);
      chartData[BONUS].push([x, bonus]);
      chartData[SALARY].push([x, salary]);
      chartData[TOTAL].push([x, total]);

      if (startIsLastEntry) {
        chartData[INFL].push([x, total]);
        return;
      }

      // calculate inflation rate from first job (or clicked job)
      const endYear = dateHelper(entryDate).year;
      if (endYear >= startYear) {
        for (; startYear < endYear; startYear += 1) {
          startTC *= inflationKey[startYear];
        }
        chartData[INFL].push([x, startTC]);
      } else {
        chartData[INFL].push([x, bonus + salary + (stockAdj || stock)]);
      }
    });
  }

  return chartData;
};
