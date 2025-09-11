import * as Highcharts from "highcharts";
import { xAxisYears } from "../../../../constants/f1";

export const standingsTTFormatter = function (this: Highcharts.Point): string {
  let tooltip = `Year: <b>${xAxisYears[this.x]}</b><br/>`;

  (this.series.data || []).forEach((point: Highcharts.Point, i: number) => {
    const isCurrent = point.x === this.x;

    tooltip += isCurrent ? "<b>" : "";
    tooltip += !point.y ? "-" : point.y;
    tooltip += isCurrent ? "</b>" : "";
    tooltip += i < this.series.data.length - 1 ? ", " : ": ";
  });

  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  tooltip += `<span style="color: ${this.color?.toString()};">&#11044;</span> <b>${this.series.name}</b><br/>`;

  return tooltip;
};
