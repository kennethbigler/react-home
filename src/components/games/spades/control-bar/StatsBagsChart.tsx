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

setHighcharts(Highcharts);

export interface StatsBagsChartProps {
  initials: string;
  lifeBags: [number, number, number, number, number];
  missedBids: [number, number, number, number];
  color: string;
}

const options: Highcharts.Options = {
  chart: {
    zooming: { type: "xy" },
    height: 340,
    backgroundColor: "transparent",
  },
  plotOptions: { column: { pointPadding: 0 } },
};

const StatsBagsChart = ({
  initials,
  lifeBags,
  missedBids,
  color,
}: StatsBagsChartProps) => {
  const expBid = Math.round(lifeBags[lifeBags.length - 1]);

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <Chart highcharts={Highcharts} options={options}>
        <Accessibility enabled={true} />
        <Credits enabled={false} />
        <Legend enabled={false} />
        <Title style={{ color }}>Bags</Title>
        <Tooltip shared={true} />
        <PlotOptions series={{ marker: { enabled: false }, lineWidth: 2 }} />
        <XAxis
          categories={initials.split("")}
          lineColor={color}
          // @ts-expect-error: types are wrong in @highcharts/react
          labels={{ style: { color } }}
        />
        <YAxis
          floor={0}
          gridLineDashStyle="Dot"
          allowDecimals={false}
          title={{ text: undefined }}
          lineColor={color}
          // @ts-expect-error: types are wrong in @highcharts/react
          labels={{ style: { color } }}
        />
        <Series
          type="column"
          options={{ name: "💰" }}
          data={lifeBags.slice(0, -1)}
        />
        <Series type="column" options={{ name: "🎰" }} data={missedBids} />
        <Series
          type="spline"
          options={{ name: "✅", color, lineWidth: 5 }}
          data={[expBid, expBid, expBid, expBid]}
        />
      </Chart>
    </figure>
  );
};

export default StatsBagsChart;
