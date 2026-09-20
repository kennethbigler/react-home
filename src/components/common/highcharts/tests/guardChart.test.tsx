import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { guardChart } from "../guardChart";

describe("common | highcharts | guardChart", () => {
  it("shows ChartUnavailable when the lazy loader rejects, keeping surrounding content", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const BrokenChart = guardChart<Record<string, never>>(() =>
      Promise.reject(new Error("chunk failed")),
    );

    render(
      <>
        <h1>Page title</h1>
        <BrokenChart />
      </>,
    );

    expect(
      screen.getByRole("heading", { name: "Page title" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/chart failed to load/i, {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Page title" }),
    ).toBeInTheDocument();

    consoleError.mockRestore();
  });

  it("shows a polite loading status while the chart chunk resolves", async () => {
    let resolveLoader!: (value: { default: () => ReactElement }) => void;
    const loader = new Promise<{ default: () => ReactElement }>((resolve) => {
      resolveLoader = resolve;
    });

    const SlowChart = guardChart<Record<string, never>>(() => loader);

    render(<SlowChart />);

    expect(screen.getByRole("status")).toHaveTextContent(/loading chart/i);

    resolveLoader({ default: () => <div>chart ready</div> });

    expect(await screen.findByText("chart ready")).toBeInTheDocument();
    expect(screen.queryByText(/loading chart/i)).not.toBeInTheDocument();
  });
});
