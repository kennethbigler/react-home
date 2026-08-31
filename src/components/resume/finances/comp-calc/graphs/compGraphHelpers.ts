import { orange } from "@mui/material/colors";
import dateHelper from "@/apis/DateHelper";
import usDollar from "@/apis/usDollar";
import type { CompCalcEntry, CompEntry } from "@/jotai/comp-calc-atom";
import {
  bonusColor,
  salaryColor,
  stockColor,
} from "@/components/resume/finances/shared/chartPalette";
import {
  entryDateToTimestamp,
  formatTooltipRow,
  getInflationTooltipValue,
  type InflationTooltipOptions,
  type TooltipPoint,
} from "@/components/resume/finances/shared/chartHelpers";
import { getInflationRate } from "@/components/resume/finances/shared/inflation";

export const STOCK = 0;
export const BONUS = 1;
export const SALARY = 2;
export const TOTAL = 3;
export const INFL = 4;

/** Series color order matches STOCK / BONUS / SALARY / TOTAL. */
export const compSeriesColors: string[] = [
  stockColor,
  bonusColor,
  salaryColor,
  orange[900],
];

type CompChartPoint = [number, number];

const stackedSeriesNames = new Set(["Stock", "Bonus", "Salary"]);

export const formatCompTooltip = (
  points: TooltipPoint[],
  options: InflationTooltipOptions = {},
) => {
  const adjustedTotal = points.reduce(
    (total, point) =>
      stackedSeriesNames.has(point.series.name)
        ? total + (point.y || 0)
        : total,
    0,
  );

  const rows = points.map((point) =>
    formatTooltipRow(point, getInflationTooltipValue(point, options)),
  );

  return [
    "<b>Compensation</b>",
    ...rows,
    `&#9679; *Total: <b>${usDollar.format(adjustedTotal)}</b>`,
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
    const safeStartIdx = Math.min(
      Math.max(startIdx, 0),
      compEntries.length - 1,
    );
    let startYear = dateHelper(compEntries[safeStartIdx].entryDate).year;
    let startTC =
      compEntries[safeStartIdx].salary +
      compEntries[safeStartIdx].bonus +
      (compCalcEntries[safeStartIdx].stockAdj ||
        compCalcEntries[safeStartIdx].stock);
    const startIsLastEntry = safeStartIdx === compEntries.length - 1;

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
          startTC *= getInflationRate(startYear);
        }
        chartData[INFL].push([x, startTC]);
      } else {
        chartData[INFL].push([x, bonus + salary + (stockAdj || stock)]);
      }
    });
  }

  return chartData;
};
