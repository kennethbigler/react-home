import { useAtomValue } from "jotai";
import {
  Chart,
  Credits,
  Legend,
  PlotOptions,
  Series,
  setHighcharts,
  Title,
  Tooltip,
  XAxis,
  YAxis,
} from "@highcharts/react";
import { Accessibility } from "@highcharts/react/options/Accessibility";
import Highcharts from "highcharts/highcharts.src";
import "highcharts/modules/accessibility";
import themeAtom from "../../../../jotai/theme-atom";
import {
  CompCalcEntry,
  CompEntry,
} from "../../../../jotai/comp-calculator-atom";
import dateHelper from "../../../../apis/DateHelper";
import colors from "./colors";
import { SeriesClickCallbackFunction } from "highcharts";

setHighcharts(Highcharts);

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
  2025: 1.027,
};

const staticOptions: Highcharts.Options = {
  chart: { type: "area", backgroundColor: "transparent" },
};

interface CompChartProps {
  startIdx: number;
  compCalcEntries: CompCalcEntry[];
  compEntries: CompEntry[];
  onClick: SeriesClickCallbackFunction;
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
    plotOptions: {
      area: {
        stacking: "normal",
        lineColor: color,
        lineWidth: 1,
        marker: { lineWidth: 1, lineColor: color },
      },
    },
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <Chart highcharts={Highcharts} options={options}>
        <Accessibility enabled={true} />
        <Credits enabled={false} />
        <Legend enabled={false} />
        <Title style={{ color }}>Total Comp</Title>
        <XAxis visible={false} />
        <YAxis
          title={{ text: undefined }}
          // @ts-expect-error: types are wrong in @highcharts/react
          labels={{ style: { color } }}
        />
        <Tooltip
          shared={true}
          headerFormat={"<h3>Compensation</h3><br />"}
          pointFormat={
            '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>${point.y:,.2f}</b><br />'
          }
          footerFormat={"\u25CF *Total: $<b>{point.total:,.2f}</b>"}
        />
        <PlotOptions
          series={{ cursor: "pointer", events: { click: onClick } }}
        />
        <Series
          type="area"
          options={{ name: "Stock" }}
          data={compChartData[STOCK]}
        />
        <Series
          type="area"
          options={{ name: "Bonus" }}
          data={compChartData[BONUS]}
        />
        <Series
          type="area"
          options={{ name: "Salary" }}
          data={compChartData[SALARY]}
        />
        <Series
          type="spline"
          options={{ name: "Total" }}
          data={compChartData[TOTAL]}
        />
        <Series
          type="spline"
          options={{ name: "Inflation" }}
          data={compChartData[INFL]}
        />
      </Chart>
    </figure>
  );
};

export default CompChart;
