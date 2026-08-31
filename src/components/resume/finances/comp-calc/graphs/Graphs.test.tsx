import {
  getBreakdownSeriesData,
  getSeriesByName,
  resetCapturedChartConfig,
  selectChartPoint,
  getChartOptions,
} from "@/components/common/highcharts/tests/highchartsMocks";
import { beforeEach, describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import { render, screen, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import Graphs from "./Graphs";
import {
  BONUS,
  SALARY,
  STOCK,
  buildCompChartData,
  compSeriesColors,
  formatCompTooltip,
} from "./compGraphHelpers";
import type { CompCalcEntry, CompEntry } from "@/jotai/comp-calc-atom";
import themeAtom, { darkTheme, lightTheme } from "@/jotai/theme-atom";
const sliceColors = {
  Stock: compSeriesColors[STOCK],
  Bonus: compSeriesColors[BONUS],
  Salary: compSeriesColors[SALARY],
} as const;

const breakdownPoint = (name: keyof typeof sliceColors, y: number) => ({
  name,
  y,
  color: sliceColors[name],
});

describe("Graphs", () => {
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
    {
      entryDate: "2022-01",
      salary: 140000,
      bonus: 20000,
      stockTick: "AAPL",
      priceThen: 140,
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
    {
      stock: 70000,
      stockAdj: 0,
      total: 230000,
      totalAdj: 230000,
      netDiff: 0,
      grantThen: 140000,
      grantNow: 140000,
    },
  ];

  const renderGraphs = () =>
    render(
      <Provider>
        <Graphs
          compEntries={mockCompEntries}
          compCalcEntries={mockCompCalcEntries}
        />
      </Provider>,
    );

  beforeEach(() => {
    resetCapturedChartConfig();
  });

  it("renders both CompChart and BreakdownChart", () => {
    renderGraphs();

    expect(screen.getByText("Total Comp")).toBeInTheDocument();
    expect(screen.getByText("Comp Breakdown")).toBeInTheDocument();
    expect(screen.getAllByTestId("highcharts-chart").length).toBe(2);
  });

  it("renders nothing when both entry arrays are empty", () => {
    const { container } = render(
      <Provider>
        <Graphs compEntries={[]} compCalcEntries={[]} />
      </Provider>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("uses dark theme colors in the breakdown chart", () => {
    const store = createStore();
    store.set(themeAtom, darkTheme);

    render(
      <Provider store={store}>
        <Graphs
          compEntries={mockCompEntries}
          compCalcEntries={mockCompCalcEntries}
        />
      </Provider>,
    );

    expect(getChartOptions().colors).toBeDefined();
    expect(screen.getByText("Comp Breakdown")).toBeInTheDocument();
  });

  it("uses light theme colors in the breakdown chart", () => {
    const store = createStore();
    store.set(themeAtom, lightTheme);

    render(
      <Provider store={store}>
        <Graphs
          compEntries={mockCompEntries}
          compCalcEntries={mockCompCalcEntries}
        />
      </Provider>,
    );

    expect(screen.getByText("Comp Breakdown")).toBeInTheDocument();
  });

  it("initializes the breakdown chart with the last entry values", () => {
    renderGraphs();

    expect(getBreakdownSeriesData()).toEqual([
      breakdownPoint("Stock", 70000),
      breakdownPoint("Bonus", 20000),
      breakdownPoint("Salary", 140000),
    ]);
  });

  it("updates the breakdown chart when the latest entry data changes", () => {
    const { rerender } = render(
      <Provider>
        <Graphs
          compEntries={mockCompEntries}
          compCalcEntries={mockCompCalcEntries}
        />
      </Provider>,
    );

    const updatedEntries = [
      ...mockCompEntries.slice(0, -1),
      {
        ...mockCompEntries[mockCompEntries.length - 1],
        salary: 150000,
        bonus: 25000,
      },
    ];
    const updatedCalcEntries = [
      ...mockCompCalcEntries.slice(0, -1),
      {
        ...mockCompCalcEntries[mockCompCalcEntries.length - 1],
        stock: 80000,
        stockAdj: 90000,
      },
    ];

    rerender(
      <Provider>
        <Graphs
          compEntries={updatedEntries}
          compCalcEntries={updatedCalcEntries}
        />
      </Provider>,
    );

    expect(getBreakdownSeriesData()).toEqual([
      breakdownPoint("Stock", 90000),
      breakdownPoint("Bonus", 25000),
      breakdownPoint("Salary", 150000),
    ]);
  });

  it("includes zero-value slices in the breakdown chart", async () => {
    const { container } = render(
      <Provider>
        <Graphs
          compEntries={[
            {
              entryDate: "2022-01",
              salary: 140000,
              bonus: 0,
              stockTick: "",
              priceThen: 0,
              grantDuration: 4,
              grantQty: 0,
            },
          ]}
          compCalcEntries={[
            {
              stock: 0,
              stockAdj: 0,
              total: 140000,
              totalAdj: 140000,
              netDiff: 0,
              grantThen: 0,
              grantNow: 0,
            },
          ]}
        />
      </Provider>,
    );

    expect(getBreakdownSeriesData()).toEqual([
      breakdownPoint("Stock", 0),
      breakdownPoint("Bonus", 0),
      breakdownPoint("Salary", 140000),
    ]);

    const breakdownTitle = screen.getByText("Comp Breakdown");
    expect(breakdownTitle).toBeVisible();
    expect(breakdownTitle.closest("figure")).toBeInTheDocument();

    selectChartPoint(0);

    expect(await axe(container)).toHaveNoViolations();
  });

  it("exposes accessible breakdown output and keyboard point selection", async () => {
    const { container } = renderGraphs();

    const breakdownTitle = screen.getByText("Comp Breakdown");
    const breakdownFigure = breakdownTitle.closest("figure");
    expect(breakdownFigure).toBeInTheDocument();
    expect(breakdownTitle).toBeVisible();

    selectChartPoint(0);

    await waitFor(() => {
      expect(getBreakdownSeriesData()).toEqual([
        breakdownPoint("Stock", 55000),
        breakdownPoint("Bonus", 10000),
        breakdownPoint("Salary", 100000),
      ]);
    });

    expect(await axe(container)).toHaveNoViolations();
  });

  it("clamps chart selection when entries are removed after selecting the last point", async () => {
    const { rerender } = render(
      <Provider>
        <Graphs
          compEntries={mockCompEntries}
          compCalcEntries={mockCompCalcEntries}
        />
      </Provider>,
    );

    selectChartPoint(2);

    await waitFor(() => {
      expect(getBreakdownSeriesData()).toEqual([
        breakdownPoint("Stock", 70000),
        breakdownPoint("Bonus", 20000),
        breakdownPoint("Salary", 140000),
      ]);
    });

    rerender(
      <Provider>
        <Graphs
          compEntries={mockCompEntries.slice(0, 2)}
          compCalcEntries={mockCompCalcEntries.slice(0, 2)}
        />
      </Provider>,
    );

    expect(getBreakdownSeriesData()).toEqual([
      breakdownPoint("Stock", 65000),
      breakdownPoint("Bonus", 15000),
      breakdownPoint("Salary", 120000),
    ]);
    expect(screen.getByText("Total Comp")).toBeInTheDocument();
  });

  it("updates the breakdown chart when an earlier point is selected", async () => {
    renderGraphs();

    selectChartPoint(1);

    await waitFor(() => {
      expect(getBreakdownSeriesData()).toEqual([
        breakdownPoint("Stock", 65000),
        breakdownPoint("Bonus", 15000),
        breakdownPoint("Salary", 120000),
      ]);
    });
  });

  it("recalculates the inflation line when an earlier point is selected", async () => {
    renderGraphs();

    const initialInflation = getSeriesByName("Inflation")?.data;

    selectChartPoint(1);

    await waitFor(() => {
      const updatedInflation = getSeriesByName("Inflation")?.data;
      expect(updatedInflation).not.toEqual(initialInflation);
    });
  });

  it("targets the correct entry on consecutive point selections", async () => {
    renderGraphs();

    selectChartPoint(1);

    await waitFor(() => {
      expect(getBreakdownSeriesData()).toEqual([
        breakdownPoint("Stock", 65000),
        breakdownPoint("Bonus", 15000),
        breakdownPoint("Salary", 120000),
      ]);
    });

    selectChartPoint(2);

    await waitFor(() => {
      expect(getBreakdownSeriesData()).toEqual([
        breakdownPoint("Stock", 70000),
        breakdownPoint("Bonus", 20000),
        breakdownPoint("Salary", 140000),
      ]);
    });
  });

  it("uses stockAdj over stock when an earlier point is selected", async () => {
    const entriesWithStockAdj: CompCalcEntry[] = [
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

    render(
      <Provider>
        <Graphs
          compEntries={mockCompEntries.slice(0, 2)}
          compCalcEntries={entriesWithStockAdj}
        />
      </Provider>,
    );

    selectChartPoint(0);

    await waitFor(() => {
      expect(getBreakdownSeriesData()?.[0]).toEqual(
        breakdownPoint("Stock", 55000),
      );
    });
  });

  it("falls back to stock when stockAdj is zero for the selected point", async () => {
    const entriesWithZeroStockAdj: CompCalcEntry[] = [
      {
        stock: 50000,
        stockAdj: 0,
        total: 160000,
        totalAdj: 160000,
        netDiff: 0,
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
      {
        stock: 70000,
        stockAdj: 75000,
        total: 230000,
        totalAdj: 235000,
        netDiff: 5000,
        grantThen: 140000,
        grantNow: 145000,
      },
    ];

    render(
      <Provider>
        <Graphs
          compEntries={mockCompEntries}
          compCalcEntries={entriesWithZeroStockAdj}
        />
      </Provider>,
    );

    expect(getBreakdownSeriesData()?.[0]).toEqual(
      breakdownPoint("Stock", 75000),
    );

    selectChartPoint(0);

    await waitFor(() => {
      expect(getBreakdownSeriesData()?.[0]).toEqual(
        breakdownPoint("Stock", 50000),
      );
    });
  });

  it("shows the final inflation value when hovering the selected point", () => {
    const tooltip = formatCompTooltip(
      [
        { y: 100000, series: { color: "green", name: "Stock" } },
        { y: 10000, series: { color: "orange", name: "Bonus" } },
        { y: 120000, series: { color: "blue", name: "Salary" } },
        { y: 230000, series: { color: "brown", name: "Total" } },
        { y: 190000, series: { color: "black", name: "Inflation" } },
      ],
      {
        finalInflationValue: 250000,
        hoveredPointIndex: 1,
        selectedPointIndex: 1,
      },
    );

    expect(tooltip).toContain("Inflation: <b>$250,000.00</b>");
    expect(tooltip).not.toContain("Inflation: <b>$190,000.00</b>");
  });

  it("shows the step inflation value when hovering a non-selected point", () => {
    const tooltip = formatCompTooltip(
      [{ y: 190000, series: { color: "black", name: "Inflation" } }],
      {
        finalInflationValue: 250000,
        hoveredPointIndex: 0,
        selectedPointIndex: 1,
      },
    );

    expect(tooltip).toContain("Inflation: <b>$190,000.00</b>");
    expect(tooltip).not.toContain("Inflation: <b>$250,000.00</b>");
  });

  it("formats missing tooltip values with defaults", () => {
    const tooltip = formatCompTooltip([
      { y: undefined, series: { color: undefined, name: "Stock" } },
      { y: 25000, series: { color: "orange", name: "Bonus" } },
      { y: 100000, series: { color: "blue", name: "Salary" } },
      { y: undefined, series: { color: "black", name: "Inflation" } },
    ]);

    expect(tooltip).toContain('style="color:inherit"');
    expect(tooltip).toContain("Stock: <b>$0.00</b>");
    expect(tooltip).toContain("Inflation: <b>$0.00</b>");
    expect(tooltip).toContain("*Total: <b>$125,000.00</b>");
  });

  it("matches inflation to total for every point when the last point starts inflation", () => {
    const chartData = buildCompChartData(
      mockCompEntries.length - 1,
      mockCompCalcEntries,
      mockCompEntries,
    );

    expect(chartData[4]).toEqual(chartData[3]);
  });

  it("uses actual compensation for entries before the selected inflation start", () => {
    const chartData = buildCompChartData(
      1,
      mockCompCalcEntries,
      mockCompEntries,
    );

    expect(chartData[4][0][1]).toBe(
      mockCompEntries[0].salary +
        mockCompEntries[0].bonus +
        mockCompCalcEntries[0].stockAdj,
    );
    expect(chartData[4][1][1]).toBeGreaterThan(chartData[4][0][1]);
  });

  it("returns empty chart series without compensation entries", () => {
    expect(buildCompChartData(0, [], [])).toEqual([[], [], [], [], []]);
  });

  it("uses entry dates as x-axis timestamps", () => {
    const chartData = buildCompChartData(
      0,
      mockCompCalcEntries,
      mockCompEntries,
    );

    expect(chartData[0].map(([x]) => x)).toEqual([
      Date.UTC(2020, 0, 1),
      Date.UTC(2021, 0, 1),
      Date.UTC(2022, 0, 1),
    ]);
    expect(chartData[0][1][0]).toBeGreaterThan(chartData[0][0][0]);
    expect(chartData[0][2][0]).toBeGreaterThan(chartData[0][1][0]);
  });
});
