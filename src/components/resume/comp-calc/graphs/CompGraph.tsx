import { useAtomValue } from "jotai";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import themeAtom from "../../../../jotai/theme-atom";
import {
  CompCalcEntry,
  CompEntry,
} from "../../../../jotai/comp-calculator-atom";
import dateHelper from "../../../../apis/DateHelper";
import colors from "./colors";

const STOCK = 0;
const BONUS = 1;
const SALARY = 2;
const TOTAL = 3;
const INFL = 4;

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
};

const staticOptions: Highcharts.Options = {
  accessibility: { enabled: true },
  chart: { type: "area", backgroundColor: "transparent" },
  credits: { enabled: false },
  legend: { enabled: false },
  title: { text: "Total Comp" },
  xAxis: { visible: false },
  // @ts-expect-error: types are wrong in highcharts-react-official
  yAxis: { title: { enabled: false } },
  tooltip: {
    shared: true,
    headerFormat: "<h3>Compensation</h3><br />",
    pointFormat:
      '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>${point.y:,.2f}</b><br />',
    footerFormat: "\u25CF *Total: $<b>{point.total:,.2f}</b>",
  },
};

interface CompChartProps {
  startIdx: number;
  compCalcEntries: CompCalcEntry[];
  compEntries: CompEntry[];
  onClick: (e: Highcharts.SeriesClickEventObject) => void;
}

const CompChart = ({
  startIdx,
  compCalcEntries,
  compEntries,
  onClick,
}: CompChartProps) => {
  // process theme
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  // calculate chart data
  const compChartData: number[][] = [[], [], [], [], []];
  if (compEntries.length > 0) {
    // set start basis for inflation calculation
    let startYear = dateHelper(compEntries[startIdx].entryDate).year;
    let startTC =
      compEntries[startIdx].salary +
      compEntries[startIdx].bonus +
      (compCalcEntries[startIdx].stockAdj || compCalcEntries[startIdx].stock);

    // calculate chart data
    compEntries.forEach(({ bonus, salary, entryDate }, i) => {
      const { stock, stockAdj } = compCalcEntries[i];
      compChartData[STOCK].push(stockAdj || stock);
      compChartData[BONUS].push(bonus);
      compChartData[SALARY].push(salary);
      compChartData[TOTAL].push(stock + bonus + salary);
      // calculate inflation rate from first job (or clicked job)
      const endYear = dateHelper(entryDate).year;
      if (endYear >= startYear) {
        for (; startYear < endYear; startYear += 1) {
          startTC *= inflationKey[startYear];
        }
        compChartData[INFL].push(startTC);
      } else {
        compChartData[INFL].push(bonus + salary + (stockAdj || stock));
      }
    });
  }

  // set chart options
  const options: Highcharts.Options = {
    ...staticOptions,
    colors: [...colors, color],
    title: { ...staticOptions.title, style: { color } },
    yAxis: { ...staticOptions.yAxis, labels: { style: { color } } },
    plotOptions: {
      area: {
        stacking: "normal",
        lineColor: color,
        lineWidth: 1,
        marker: { lineWidth: 1, lineColor: color },
      },
      series: { cursor: "pointer", events: { click: onClick } },
    },
    series: [
      { type: "area", name: "Stock", data: [...compChartData[STOCK]] },
      { type: "area", name: "Bonus", data: [...compChartData[BONUS]] },
      { type: "area", name: "Salary", data: [...compChartData[SALARY]] },
      { type: "spline", name: "Total", data: [...compChartData[TOTAL]] },
      { type: "spline", name: "Inflation", data: [...compChartData[INFL]] },
    ],
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </figure>
  );
};

export default CompChart;
