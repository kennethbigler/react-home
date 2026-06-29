import type { ComponentProps } from "react";
import "./tests/highchartsMocks";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "jotai";
import CompChart from "./CompGraph";
import {
  getChartOptions,
  getSeriesByName,
  getTooltipFollowTouchMove,
  resetCapturedCompChartConfig,
  selectChartPoint,
} from "./tests/highchartsMocks";
import {
  CompCalcEntry,
  CompEntry,
} from "../../../../jotai/comp-calculator-atom";

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
    resetCapturedCompChartConfig();
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

  it("forwards the absolute entry index when startIdx is not zero", () => {
    const { onPointSelect } = renderChart({ startIdx: 1 });

    selectChartPoint(2);

    expect(onPointSelect).toHaveBeenCalledWith(2);
  });

  it("ignores point clicks without an index", () => {
    const { onPointSelect } = renderChart();

    selectChartPoint(undefined);

    expect(onPointSelect).not.toHaveBeenCalled();
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
});
