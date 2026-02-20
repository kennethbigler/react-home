import { memo } from "react";
import {
  Chart,
  Credits,
  Series,
  setHighcharts,
  Title,
  Tooltip,
  YAxis,
} from "@highcharts/react";
import { Accessibility } from "@highcharts/react/options/Accessibility";
import Highcharts from "highcharts/highcharts.src";
import "highcharts/modules/accessibility";
import { green, grey, red } from "@mui/material/colors";
import { Grid } from "@mui/material";

setHighcharts(Highcharts);

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

const staticOptions: Highcharts.Options = {
  chart: { type: "gauge", backgroundColor: "transparent" },
  pane: { startAngle: -150, endAngle: 150, background: undefined },
};

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
    const options: Highcharts.Options = {
      ...staticOptions,
      series: [
        {
          name,
          data: [val],
          tooltip: { valueSuffix: ` ${label}` },
          dataLabels: { format: label, borderWidth: 0, color },
          dial: { backgroundColor: color },
          pivot: { backgroundColor: color },
          type: "gauge",
        },
      ],
    };

    return (
      <Grid size={{ xs: 12, sm: 4, lg: 2, xxxl: 1 }}>
        <figure style={{ margin: 0, width: "100%" }}>
          <Chart highcharts={Highcharts} options={options}>
            <Accessibility enabled={true} />
            <Credits enabled={false} />
            <Tooltip valueSuffix={` ${label}`} />
            <Title style={{ color }}>
              {name} {title}
            </Title>
            <YAxis
              min={min}
              max={maxVal}
              // @ts-expect-error: types are wrong in @highcharts/react
              labels={{ distance: -26, style: { color } }}
              // @ts-expect-error: types are wrong in @highcharts/react
              plotBands={[
                { from: min, to: greenEnd, color: green[400] },
                { from: startRedVal, to: maxVal, color: red[500] },
                {
                  from: greenEnd,
                  to: startRedVal,
                  color: color === "white" ? grey[800] : grey[200],
                },
              ]}
            />
            <Series
              options={{
                name,
                tooltip: { valueSuffix: ` ${label}` },
                dataLabels: { format: label, borderWidth: 0, color },
                dial: { backgroundColor: color },
                pivot: { backgroundColor: color },
              }}
              data={[val]}
              type="gauge"
            />
          </Chart>
        </figure>
      </Grid>
    );
  },
);

CarSpeedoGraph.displayName = "CarSpeedoGraph";

export default CarSpeedoGraph;
