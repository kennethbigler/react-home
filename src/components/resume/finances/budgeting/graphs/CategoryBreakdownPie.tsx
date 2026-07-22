import { useAtomValue } from "jotai";
import {
  Chart,
  Credits,
  Legend,
  PlotOptions,
  Series,
  Title,
  Tooltip,
} from "@highcharts/react";
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import Highcharts from "../../../../common/highcharts/coreHighcharts";
import themeAtom from "../../../../../jotai/theme-atom";
import usDollar from "../../../../../apis/usDollar";
import type { PiePoint } from "./types";

const options = {
  chart: { type: "pie", backgroundColor: "transparent" },
};

interface CategoryBreakdownPieProps {
  data: PiePoint[];
  title: string;
}

const CategoryBreakdownPie = ({ data, title }: CategoryBreakdownPieProps) => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  const seriesData = data.map((point) => ({
    ...point,
    yFormatted: usDollar.format(point.y),
  }));

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <Chart highcharts={Highcharts} options={options}>
        <Accessibility enabled={true} />
        <Credits enabled={false} />
        <Legend enabled={false} />
        <Title style={{ color }}>{title}</Title>
        <Tooltip pointFormat="<b>{point.yFormatted}</b>" />
        <PlotOptions
          series={{
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: [
              { format: "{point.name}", color },
              {
                distance: -30,
                format: "{point.percentage:.0f}%",
                style: { fontSize: "1em", color },
              },
            ],
          }}
        />
        <Series type="pie" data={seriesData} />
      </Chart>
    </figure>
  );
};

CategoryBreakdownPie.displayName = "CategoryBreakdownPie";

export default CategoryBreakdownPie;
