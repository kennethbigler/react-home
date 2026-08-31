import { useMemo } from "react";
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
import Highcharts from "@/components/common/highcharts/coreHighcharts";
import type { CompCalcEntry, CompEntry } from "@/jotai/comp-calc-atom";
import ChartFigure from "@/components/resume/finances/shared/ChartFigure";
import { formatCompactAxisCurrency } from "@/components/resume/finances/shared/chartHelpers";
import useChartTextColor from "@/components/resume/finances/shared/useChartTextColor";
import {
  BONUS,
  INFL,
  SALARY,
  STOCK,
  TOTAL,
  buildCompChartData,
  compSeriesColors,
  formatCompTooltip,
} from "./compGraphHelpers";

const staticOptions: Highcharts.Options = {
  chart: { type: "area", backgroundColor: "transparent" },
};

interface CompChartProps {
  startIdx: number;
  compCalcEntries: CompCalcEntry[];
  compEntries: CompEntry[];
  onPointSelect: (index: number) => void;
}

const CompChart = ({
  startIdx,
  compCalcEntries,
  compEntries,
  onPointSelect,
}: CompChartProps) => {
  const color = useChartTextColor();

  const { compChartData, options } = useMemo(() => {
    const chartData = buildCompChartData(
      startIdx,
      compCalcEntries,
      compEntries,
    );

    const chartOptions: Highcharts.Options = {
      ...staticOptions,
      colors: [...compSeriesColors, color],
      plotOptions: {
        area: {
          stacking: "normal",
          lineColor: color,
          lineWidth: 1,
          marker: { lineWidth: 1, lineColor: color },
          // Expand hit target to the filled area so taps register on touch devices.
          trackByArea: true,
        },
      },
    };

    return { compChartData: chartData, options: chartOptions };
  }, [compEntries, compCalcEntries, startIdx, color]);

  const tooltipFormatter =
    useMemo((): Highcharts.TooltipFormatterCallbackFunction => {
      const finalInflationValue = compChartData[INFL].at(-1)?.[1];

      return function (this: Highcharts.Point) {
        const hoveredPointIndex = this.points?.[0]?.index ?? this.index;

        return formatCompTooltip(this.points ?? [this], {
          finalInflationValue,
          hoveredPointIndex,
          selectedPointIndex: startIdx,
        });
      };
    }, [compChartData, startIdx]);

  const handlePointClick: Highcharts.PointClickCallbackFunction = function () {
    const { index } = this;
    if (index !== undefined) {
      onPointSelect(index);
    }
  };

  return (
    <ChartFigure>
      {/* Remount when entry data/theme changes so markers stay visible.
          Omit startIdx so clicking a point only updates the inflation series. */}
      <Chart
        key={JSON.stringify([color, compEntries, compCalcEntries])}
        highcharts={Highcharts}
        options={options}
      >
        <Accessibility enabled={true} />
        <Credits enabled={false} />
        <Legend enabled={false} />
        <Title style={{ color }}>Total Comp</Title>
        <XAxis type="datetime" visible={false} />
        <YAxis
          title={{ text: undefined }}
          labels={{
            style: { color },
            formatter: function () {
              return formatCompactAxisCurrency(Number(this.value));
            },
          }}
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
        <Series
          type="area"
          options={{ name: "Stock" }}
          data={compChartData[STOCK]}
        />
        <Series
          type="area"
          options={{ name: "Bonus" }}
          data={compChartData[BONUS]}
        />
        <Series
          type="area"
          options={{ name: "Salary" }}
          data={compChartData[SALARY]}
        />
        <Series
          type="spline"
          options={{ name: "Total" }}
          data={compChartData[TOTAL]}
        />
        <Series
          type="spline"
          options={{ name: "Inflation" }}
          data={compChartData[INFL]}
        />
      </Chart>
    </ChartFigure>
  );
};

export default CompChart;
