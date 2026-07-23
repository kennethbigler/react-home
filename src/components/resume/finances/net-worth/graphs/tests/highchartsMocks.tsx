import type { ReactNode } from "react";

const chartTestState = vi.hoisted(() => ({
  chartOptions: {} as Highcharts.Options,
  series: [] as Array<{
    type?: string;
    name?: string;
    data?: unknown;
  }>,
  tooltipFollowTouchMove: undefined as boolean | undefined,
  tooltipFormatter: null as Highcharts.TooltipFormatterCallbackFunction | null,
  pointClickHandler: null as Highcharts.PointClickCallbackFunction | null,
}));

export const resetCapturedNetWorthChartConfig = () => {
  chartTestState.chartOptions = {};
  chartTestState.series = [];
  chartTestState.tooltipFollowTouchMove = undefined;
  chartTestState.tooltipFormatter = null;
  chartTestState.pointClickHandler = null;
};

export const getChartOptions = () => chartTestState.chartOptions;

export const getTooltipFormatter = () => chartTestState.tooltipFormatter;

export const formatTooltip = (context: Highcharts.Point) =>
  chartTestState.tooltipFormatter?.call(context, {} as Highcharts.Tooltip);

export const getSeriesByName = (name: string) =>
  chartTestState.series.filter((series) => series.name === name).at(-1);

export const getAreaSeriesNamesInOrder = () =>
  chartTestState.series
    .filter((series) => series.type === "area")
    .map((series) => series.name)
    .filter((name): name is string => Boolean(name));

export const getBreakdownSeriesData = () => {
  const pieSeries = chartTestState.series
    .filter((series) => series.type === "pie" && Array.isArray(series.data))
    .at(-1);

  return pieSeries?.data as Array<{ name: string; y: number }> | undefined;
};

export const selectChartPoint = (index: number | undefined) => {
  chartTestState.pointClickHandler?.call(
    { index } as Highcharts.Point,
    {} as Highcharts.PointClickEventObject,
  );
};

vi.mock("../../../../common/highcharts/coreHighcharts", () => ({
  default: {},
}));

vi.mock("highcharts/highcharts.src", () => ({
  default: {},
}));

vi.mock("highcharts/modules/accessibility", () => ({ default: vi.fn() }));

vi.mock("@highcharts/react", () => ({
  Chart: ({
    children,
    options,
  }: {
    children: ReactNode;
    options?: Highcharts.Options;
  }) => {
    chartTestState.chartOptions = options ?? {};
    return <div data-testid="highcharts-chart">{children}</div>;
  },
  Credits: () => null,
  Legend: () => null,
  PlotOptions: ({
    series,
  }: {
    series?: {
      cursor?: string;
      point?: { events?: { click?: Highcharts.PointClickCallbackFunction } };
    };
  }) => {
    if (series?.point?.events?.click) {
      chartTestState.pointClickHandler = series.point.events.click;
    }
    return null;
  },
  Series: ({
    type,
    data,
    options,
  }: {
    type?: string;
    data?: unknown;
    options?: { name?: string };
  }) => {
    chartTestState.series.push({
      type,
      data,
      name: options?.name,
    });
    return (
      <div
        data-testid="highcharts-series"
        data-name={options?.name}
        data-length={Array.isArray(data) ? data.length : 0}
      />
    );
  },
  Title: ({ children }: { children?: ReactNode }) => <span>{children}</span>,
  Tooltip: ({
    followTouchMove,
    formatter,
  }: {
    followTouchMove?: boolean;
    formatter?: Highcharts.TooltipFormatterCallbackFunction;
  }) => {
    chartTestState.tooltipFollowTouchMove = followTouchMove;
    chartTestState.tooltipFormatter = formatter ?? null;
    return null;
  },
  XAxis: () => null,
  YAxis: () => null,
  setHighcharts: vi.fn(),
}));

vi.mock("@highcharts/react/modules/Accessibility", () => ({
  Accessibility: () => null,
}));
