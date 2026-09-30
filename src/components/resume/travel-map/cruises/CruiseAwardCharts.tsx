import { memo } from "react";
import { useAtomValue } from "jotai";
import { Typography } from "@mui/material";
import {
  Chart,
  Credits,
  Legend,
  PlotOptions,
  Series,
  Title,
  Tooltip,
  XAxis,
  YAxis,
} from "@highcharts/react";
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import type Highcharts from "highcharts/highcharts.src";
import HighchartsLib from "@/components/common/highcharts/sankeyHighcharts";
import themeAtom from "@/jotai/theme-atom";
import {
  cruiseAwardCharts,
  type CruiseRankChart,
} from "@/constants/cruise-awards";

const chartOptions = (height: number): Highcharts.Options => ({
  chart: { type: "line", backgroundColor: "transparent", height },
});

/** Black on light brand fills, white on dark ones, so the rank stays readable. */
const rankLabelColor = (hex: string): string => {
  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

  return luminance > 0.55 ? "#111111" : "#ffffff";
};

const yearAxisFormatter =
  (years: readonly number[]): Highcharts.AxisLabelsFormatterCallbackFunction =>
  (point) =>
    String(years[(point.value as number) || 0] ?? "");

const rankTooltipFormatter = (years: readonly number[]) =>
  function rankTooltip(this: Highcharts.Point): string {
    let tooltip = `Year: <b>${years[this.x] ?? ""}</b><br/>`;

    (this.series.data || []).forEach((point: Highcharts.Point, i: number) => {
      const isCurrent = point.x === this.x;

      tooltip += isCurrent ? "<b>" : "";
      tooltip += typeof point.y === "number" ? point.y : "-";
      tooltip += isCurrent ? "</b>" : "";
      tooltip += i < this.series.data.length - 1 ? ", " : ": ";
    });

    const award = (this.series.options.custom as { award?: string } | undefined)
      ?.award;
    const kind = award === "editors" ? "Editors' Pick" : "Cruisers' Choice";

    tooltip += `<span style="color: ${this.color?.toString()};">&#11044;</span> <b>${this.series.name}</b> (${kind})`;

    return tooltip;
  };

interface CruiseAwardStandingsProps {
  chart: CruiseRankChart;
  color: string;
}

const CruiseAwardStandings = ({ chart, color }: CruiseAwardStandingsProps) => {
  const singleRank = chart.ranks.length === 1;

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <Chart
        highcharts={HighchartsLib}
        options={chartOptions(singleRank ? 220 : 400)}
      >
        <Accessibility enabled={true} description={chart.caption} />
        <Credits enabled={false} />
        <Legend enabled={false} />
        <Tooltip useHTML={true} formatter={rankTooltipFormatter(chart.years)} />
        <Title style={{ color }}>{chart.title}</Title>
        <XAxis
          tickPositions={chart.years.map((_year, index) => index)}
          labels={{
            style: { color },
            formatter: yearAxisFormatter(chart.years),
            rotation: chart.years.length > 6 ? -45 : 0,
          }}
        />
        <YAxis
          labels={{ style: { color } }}
          tickPositions={chart.ranks}
          min={singleRank ? chart.ranks[0] - 0.5 : chart.ranks[0]}
          max={
            singleRank
              ? chart.ranks[0] + 0.5
              : chart.ranks[chart.ranks.length - 1]
          }
          endOnTick={false}
          startOnTick={false}
          reversed={true}
          title={{ text: undefined }}
          gridLineDashStyle="Dot"
        />
        <PlotOptions
          series={{
            connectNulls: false,
            lineWidth: 5,
            marker: {
              radius: 10,
              symbol: "circle",
              lineWidth: 2,
              lineColor: color,
            },
            dataLabels: {
              enabled: true,
              format: "{y}",
              align: "center",
              verticalAlign: "middle",
            },
          }}
        />
        {chart.series.map((series) => (
          <Series
            key={`${series.name}-${series.award}`}
            options={{
              name: series.name,
              color: series.color,
              custom: { award: series.award },
              dataLabels: {
                style: {
                  color: rankLabelColor(series.color),
                  textOutline: "none",
                  fontWeight: "700",
                },
              },
            }}
            data={series.data}
          />
        ))}
      </Chart>
      <Typography
        component="figcaption"
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1 }}
      >
        {chart.caption}
      </Typography>
    </figure>
  );
};

const CruiseAwardCharts = memo(() => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  return (
    <>
      {cruiseAwardCharts.map((chart) => (
        <CruiseAwardStandings key={chart.id} chart={chart} color={color} />
      ))}
    </>
  );
});

CruiseAwardCharts.displayName = "CruiseAwardCharts";

export default CruiseAwardCharts;
