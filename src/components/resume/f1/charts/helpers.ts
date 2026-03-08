import Highcharts from "highcharts/highcharts.src";
import { xAxisYears } from "../../../../constants/f1";

export const xAxisLabelFormatter: Highcharts.AxisLabelsFormatterCallbackFunction =
  function (point) {
    return xAxisYears[(point.value as number) || 0].toString();
  };

export const standingsTTFormatter = function (this: Highcharts.Point): string {
  let tooltip = `Year: <b>${xAxisYears[this.x]}</b><br/>`;

  (this.series.data || []).forEach((point: Highcharts.Point, i: number) => {
    const isCurrent = point.x === this.x;

    tooltip += isCurrent ? "<b>" : "";
    tooltip += !point.y ? "-" : point.y;
    tooltip += isCurrent ? "</b>" : "";
    tooltip += i < this.series.data.length - 1 ? ", " : ": ";
  });

  tooltip += `<span style="color: ${this.color?.toString()};">&#11044;</span> <b>${this.series.name}</b><br/>`;

  return tooltip;
};

export function pointsTTFormatter(
  point: Highcharts.Point,
  sameValuePrefix: string,
  sameValueSuffix: string,
  includeYearLine = true,
): string {
  let tooltip = includeYearLine
    ? "Year: <b>" + xAxisYears[point.x] + "</b><br/>"
    : "";
  const tooltipHist: Record<number, string> = {};

  (point.points || []).forEach((p: Highcharts.Point) => {
    const team = `<span style="color: ${p.series.color?.toString()};">&#11044;</span> ${p.series.name}`;
    const i = p.y || 0;

    if (tooltipHist[i] === undefined) {
      tooltipHist[i] = `<b>${p.y}</b>: ${team}`;
    } else {
      tooltipHist[i] += sameValuePrefix + team + sameValueSuffix;
    }
  });

  Object.keys(tooltipHist)
    .sort((a, b) => Number(b) - Number(a))
    .forEach((key) => {
      tooltip += tooltipHist[Number(key)] + "<br/>";
    });

  return tooltip;
}

export const constructorPointsTTFormatter = function (
  this: Highcharts.Point,
): string {
  return pointsTTFormatter(this, " (", ")");
};

export const driverPointsTTFormatter = function (
  this: Highcharts.Point,
): string {
  return pointsTTFormatter(this, " / ", "");
};

export const currentPointsTTFormatter = function (
  this: Highcharts.Point,
): string {
  return pointsTTFormatter(this, " / ", "", false);
};
