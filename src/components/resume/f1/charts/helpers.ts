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

export const constructorPointsTooltipFormatter = function (
  this: Highcharts.Point,
): string {
  let tooltip = "Year: <b>" + xAxisYears[this.x] + "</b><br/>";
  const tooltipHist: Record<number, string> = {};

  (this.points || []).forEach((point: Highcharts.Point) => {
    const team = `<span style="color: ${point.series.color?.toString()};">&#11044;</span> ${point.series.name}`;
    const i = point.y || 0;

    if (tooltipHist[i] === undefined) {
      tooltipHist[i] = `<b>${point.y}</b>: ${team}`;
    } else {
      tooltipHist[i] += ` (${team})`;
    }
  });

  Object.keys(tooltipHist)
    .sort((a, b) => Number(b) - Number(a))
    .forEach((key) => {
      tooltip += tooltipHist[Number(key)] + "<br/>";
    });

  return tooltip;
};

export const driverPointsTooltipFormatter = function (
  this: Highcharts.Point,
): string {
  let tooltip = "Year: <b>" + xAxisYears[this.x] + "</b><br/>";
  const tooltipHist: Record<number, string> = {};

  (this.points || []).forEach((point: Highcharts.Point) => {
    const team = `<span style="color: ${point.series.color?.toString()};">&#11044;</span> ${point.series.name}`;
    const i = point.y || 0;

    if (tooltipHist[i] === undefined) {
      tooltipHist[i] = `<b>${point.y}</b>: ${team}`;
    } else {
      tooltipHist[i] += ` / ${team}`;
    }
  });

  Object.keys(tooltipHist)
    .sort((a, b) => Number(b) - Number(a))
    .forEach((key) => {
      tooltip += tooltipHist[Number(key)] + "<br/>";
    });

  return tooltip;
};
