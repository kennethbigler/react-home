import { useMemo } from "react";
import { useAtomValue } from "jotai";
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
import Highcharts from "../../../../common/highcharts/coreHighcharts";
import themeAtom from "../../../../../jotai/theme-atom";
import type {
  NetWorthCalcEntry,
  NetWorthEntry,
} from "../../../../../jotai/finances-atom";
import colors, { getCategoryColor } from "./colors";
import {
  buildNetWorthChartData,
  formatNetWorthTooltip,
} from "./netWorthGraphHelpers";

const staticOptions: Highcharts.Options = {
  chart: { type: "area", backgroundColor: "transparent" },
};

interface NetWorthChartProps {
  startIdx: number;
  entries: NetWorthEntry[];
  calcEntries: NetWorthCalcEntry[];
  categories: string[];
  onPointSelect: (index: number) => void;
}

const NetWorthChart = ({
  startIdx,
  entries,
  calcEntries,
  categories,
  onPointSelect,
}: NetWorthChartProps) => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  const { chartData, options } = useMemo(() => {
    const data = buildNetWorthChartData(
      startIdx,
      entries,
      calcEntries,
      categories,
    );

    const chartOptions: Highcharts.Options = {
      ...staticOptions,
      colors: [...colors, color],
      legend: {
        itemStyle: { color },
        itemHoverStyle: { color },
      },
      plotOptions: {
        area: {
          stacking: "normal",
          lineColor: color,
          lineWidth: 1,
          marker: { lineWidth: 1, lineColor: color },
          trackByArea: true,
        },
      },
    };

    return { chartData: data, options: chartOptions };
  }, [entries, calcEntries, categories, startIdx, color]);

  const tooltipFormatter =
    useMemo((): Highcharts.TooltipFormatterCallbackFunction => {
      const finalInflationValue = chartData.inflation.at(-1)?.[1];

      return function (this: Highcharts.Point) {
        const hoveredPointIndex = this.points?.[0]?.index ?? this.index;

        return formatNetWorthTooltip(this.points ?? [this], {
          categoryNames: categories,
          finalInflationValue,
          hoveredPointIndex,
          selectedPointIndex: startIdx,
        });
      };
    }, [chartData, startIdx, categories]);

  const handlePointClick: Highcharts.PointClickCallbackFunction = function () {
    const { index } = this;
    if (index !== undefined) {
      onPointSelect(index);
    }
  };

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      {/* Remount when entry data/theme changes so markers stay visible.
          Omit startIdx so clicking a point only updates the inflation series. */}
      <Chart
        key={JSON.stringify([color, entries, calcEntries, categories])}
        highcharts={Highcharts}
        options={options}
      >
        <Accessibility enabled={true} />
        <Credits enabled={false} />
        <Legend />
        <Title style={{ color }}>Total Net Worth</Title>
        <XAxis type="datetime" visible={false} />
        <YAxis
          title={{ text: undefined }}
          labels={{ style: { color } }}
          // Keep series order aligned with the pie (largest first) while
          // placing the first series at the bottom of the stack.
          reversedStacks={false}
        />
        <Tooltip
          shared={true}
          useHTML={true}
          followTouchMove={false}
          formatter={tooltipFormatter}
        />
        <PlotOptions
          series={{
            cursor: "pointer",
            point: { events: { click: handlePointClick } },
          }}
        />
        {categories.map((category, i) => (
          <Series
            key={category}
            type="area"
            options={{ name: category, color: getCategoryColor(i) }}
            data={chartData.categorySeries[i]}
          />
        ))}
        <Series
          type="spline"
          options={{ name: "Inflation", color }}
          data={chartData.inflation}
        />
      </Chart>
    </figure>
  );
};

export default NetWorthChart;
