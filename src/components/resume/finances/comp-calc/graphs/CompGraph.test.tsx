import type { ComponentProps } from "react";
import {
  getChartOptions,
  getSeriesByName,
  getTooltipFollowTouchMove,
  getTooltipFormatter,
  formatTooltip,
  resetCapturedChartConfig,
  selectChartPoint,
} from "@/components/common/highcharts/tests/highchartsMocks";
import { createTheme } from "@mui/material/styles";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import CompChart from "./CompGraph";
import type { CompCalcEntry, CompEntry } from "@/jotai/comp-calc-atom";
import themeAtom, { darkTheme, lightTheme } from "@/jotai/theme-atom";

describe("CompGraph", () => {
  const mockCompEntries: CompEntry[] = [
    {
      entryDate: "2020-01",
      salary: 100000,
      bonus: 10000,
      stockTick: "AAPL",
      priceThen: 100,
      grantDuration: 4,
      grantQty: 1000,
    },
    {
      entryDate: "2021-01",
      salary: 120000,
      bonus: 15000,
      stockTick: "AAPL",
      priceThen: 120,
      grantDuration: 4,
      grantQty: 1000,
    },
  ];

  const mockCompCalcEntries: CompCalcEntry[] = [
    {
      stock: 50000,
      stockAdj: 55000,
      total: 160000,
      totalAdj: 165000,
      netDiff: 5000,
      grantThen: 100000,
      grantNow: 105000,
    },
    {
      stock: 60000,
      stockAdj: 65000,
      total: 195000,
      totalAdj: 200000,
      netDiff: 5000,
      grantThen: 120000,
      grantNow: 125000,
    },
  ];

  const renderChart = (
    props: Partial<ComponentProps<typeof CompChart>> = {},
  ) => {
    const onPointSelect = props.onPointSelect ?? vi.fn();

    render(
      <Provider>
        <CompChart
          startIdx={0}
          compEntries={mockCompEntries}
          compCalcEntries={mockCompCalcEntries}
          onPointSelect={onPointSelect}
          {...props}
        />
      </Provider>,
    );

    return { onPointSelect };
  };

  beforeEach(() => {
    resetCapturedChartConfig();
  });

  it("renders the total comp chart", () => {
    renderChart();

    expect(screen.getByText("Total Comp")).toBeInTheDocument();
    expect(screen.getByTestId("highcharts-chart")).toBeInTheDocument();
  });

  it("enables trackByArea so taps hit the filled chart area", () => {
    renderChart();

    expect(getChartOptions().plotOptions?.area?.trackByArea).toBe(true);
  });

  it("disables tooltip followTouchMove so the first tap can register as a click", () => {
    renderChart();

    expect(getTooltipFollowTouchMove()).toBe(false);
  });

  it("forwards point clicks to onPointSelect", () => {
    const { onPointSelect } = renderChart();

    selectChartPoint(1);

    expect(onPointSelect).toHaveBeenCalledWith(1);
  });

  it("forwards the clicked point index without applying startIdx offset", () => {
    const { onPointSelect } = renderChart({ startIdx: 1 });

    selectChartPoint(0);

    expect(onPointSelect).toHaveBeenCalledWith(0);
  });

  it("recalculates inflation series data when startIdx changes", () => {
    const { rerender } = render(
      <Provider>
        <CompChart
          startIdx={0}
          compEntries={mockCompEntries}
          compCalcEntries={mockCompCalcEntries}
          onPointSelect={vi.fn()}
        />
      </Provider>,
    );

    const initialInflation = getSeriesByName("Inflation")?.data;

    rerender(
      <Provider>
        <CompChart
          startIdx={1}
          compEntries={mockCompEntries}
          compCalcEntries={mockCompCalcEntries}
          onPointSelect={vi.fn()}
        />
      </Provider>,
    );

    const updatedInflation = getSeriesByName("Inflation")?.data;

    expect(initialInflation).not.toEqual(updatedInflation);
  });

  it("ignores point clicks without an index", () => {
    const { onPointSelect } = renderChart();

    selectChartPoint(undefined);

    expect(onPointSelect).not.toHaveBeenCalled();
  });

  it("uses dark theme colors when theme mode is dark", () => {
    const store = createStore();
    store.set(themeAtom, darkTheme);

    render(
      <Provider store={store}>
        <CompChart
          startIdx={0}
          compEntries={mockCompEntries}
          compCalcEntries={mockCompCalcEntries}
          onPointSelect={vi.fn()}
        />
      </Provider>,
    );

    expect(getChartOptions().colors?.at(-1)).toBe(
      createTheme({ palette: { mode: "dark" } }).palette.text.primary,
    );
  });

  it("uses light theme colors when theme mode is light", () => {
    const store = createStore();
    store.set(themeAtom, lightTheme);

    render(
      <Provider store={store}>
        <CompChart
          startIdx={0}
          compEntries={mockCompEntries}
          compCalcEntries={mockCompCalcEntries}
          onPointSelect={vi.fn()}
        />
      </Provider>,
    );

    expect(getChartOptions().colors?.at(-1)).toBe(
      createTheme({ palette: { mode: "light" } }).palette.text.primary,
    );
  });

  it("formats tooltip content for shared and single-point hovers", () => {
    renderChart({ startIdx: 1 });

    const formatter = getTooltipFormatter();
    expect(formatter).toBeTruthy();

    const tooltipPoint = {
      index: 0,
      y: 50000,
      series: { name: "Stock", color: "#111111" },
    } as Highcharts.Point;

    const sharedTooltip = formatTooltip({
      points: [
        tooltipPoint,
        {
          index: 0,
          y: 100000,
          series: { name: "Salary", color: "#222222" },
        } as Highcharts.Point,
      ],
    } as Highcharts.Point);
    const singlePointTooltip = formatTooltip(tooltipPoint);

    expect(sharedTooltip).toContain("Compensation");
    expect(sharedTooltip).toContain("*Total:");
    expect(singlePointTooltip).toContain("Stock:");
  });
});
