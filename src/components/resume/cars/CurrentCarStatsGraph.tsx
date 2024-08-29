import * as React from "react";
import * as Highcharts from "highcharts";
import highchartsAccessibility from "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import Grid from "@mui/material/Grid2";
import { green, red, yellow } from "@mui/material/colors";
import { CurrentCarStatsData } from "../../../constants/cars";

highchartsAccessibility(Highcharts); // initiate accessibility module

export interface CurrentCarStatsGraphProps extends CurrentCarStatsData {
  label: string;
  title: string;
  color: string;
}

const CurrentCarStatsGraph = React.memo(
  ({
    color,
    maxVal,
    startYellowVal,
    startRedVal,
    val,
    label,
    title,
    name,
  }: CurrentCarStatsGraphProps) => {
    const options = {
      chart: { type: "gauge", backgroundColor: null },
      title: { text: `${name} ${title}`, style: { color } },
      pane: { startAngle: -90, endAngle: 90, background: null },
      yAxis: {
        min: title === "Weight" ? 2500 : 0,
        max: maxVal,
        lineWidth: 0,
        labels: { distance: 20, style: { color } },
        plotBands: [
          {
            from: 0,
            to: startYellowVal,
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
            from: startYellowVal,
            to: startRedVal,
            color: yellow[500],
            thickness: 20,
          },
        ],
      },
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
    };

    return (
      <Grid size={{ xs: 12, sm: 4, lg: 2 }}>
        <figure style={{ margin: 0, width: "100%" }}>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </figure>
      </Grid>
    );
  },
);

export default CurrentCarStatsGraph;
