import * as React from "react";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import Grid from "@mui/material/Grid";
import { green, grey, red } from "@mui/material/colors";
import { CurrentCarStatsData } from "../../../../constants/cars";

export interface CarSpeedoGraphProps extends CurrentCarStatsData {
  label: string;
  title: string;
  color: "black" | "white";
  endGreenVal: number;
  startRedVal: number;
}

const CarSpeedoGraph = React.memo(
  ({
    color,
    maxVal,
    endGreenVal,
    startRedVal,
    val,
    label,
    title,
    name,
  }: CarSpeedoGraphProps) => {
    const min = title === "Weight" ? 2500 : 0;
    const greenEnd = Math.max(min, endGreenVal);
    const options = {
      accessibility: { enabled: true },
      credits: { enabled: false },
      pane: { startAngle: -135, endAngle: 135, background: null },
      title: { text: `${name} ${title}`, style: { color } },
      chart: { type: "gauge", backgroundColor: null },
      series: [
        {
          name,
          data: [val],
          tooltip: { valueSuffix: ` ${label}` },
          dataLabels: { format: label, borderWidth: 0, color },
          dial: { backgroundColor: color },
          pivot: { backgroundColor: color },
        },
      ],
      yAxis: {
        min,
        max: maxVal,
        lineWidth: 0,
        labels: { distance: 20, style: { color } },
        plotBands: [
          {
            from: min,
            to: greenEnd,
            color: green[400],
            thickness: 20,
          },
          {
            from: startRedVal,
            to: maxVal,
            color: red[500],
            thickness: 20,
          },
          {
            from: greenEnd,
            to: startRedVal,
            color: color === "white" ? grey[800] : grey[200],
            thickness: 20,
          },
        ],
      },
    };

    return (
      // @ts-expect-error - custom breakpoint
      <Grid size={{ xs: 12, sm: 4, lg: 2, xxxl: 1 }}>
        <figure style={{ margin: 0, width: "100%" }}>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </figure>
      </Grid>
    );
  },
);

CarSpeedoGraph.displayName = "CarSpeedoGraph";

export default CarSpeedoGraph;
