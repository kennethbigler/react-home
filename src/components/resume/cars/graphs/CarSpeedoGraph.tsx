import { memo } from "react";
import * as Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
import { green, grey, red } from "@mui/material/colors";
import { Grid } from "@mui/material";

export interface CarSpeedoGraphProps {
  val: number;
  name: string;
  maxVal: number;
  label: string;
  title: string;
  color: "black" | "white";
  endGreenVal: number;
  startRedVal: number;
}

const CarSpeedoGraph = memo(
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
    const min = 0;
    const greenEnd = Math.max(min, endGreenVal);
    const options = {
      accessibility: { enabled: true },
      chart: { type: "gauge", backgroundColor: null },
      credits: { enabled: false },
      pane: { startAngle: -150, endAngle: 150, background: null },
      title: { text: `${name} ${title}`, style: { color } },
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
        labels: { distance: -26, style: { color } },
        plotBands: [
          { from: min, to: greenEnd, color: green[400] },
          { from: startRedVal, to: maxVal, color: red[500] },
          {
            from: greenEnd,
            to: startRedVal,
            color: color === "white" ? grey[800] : grey[200],
          },
        ],
      },
    };

    return (
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
