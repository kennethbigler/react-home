import { render, screen } from "@testing-library/react";
import { ChartErrorBoundary } from "../ChartErrorBoundary";

const ThrowingChart = () => {
  throw new Error("chart boom");
};

describe("common | highcharts | ChartErrorBoundary", () => {
  it("shows a warning when a chart child throws", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ChartErrorBoundary>
        <ThrowingChart />
      </ChartErrorBoundary>,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      /chart failed to load/i,
    );
    expect(screen.getByText(/chart failed to load/i)).toBeInTheDocument();
    consoleError.mockRestore();
  });

  it("renders children when the chart loads normally", () => {
    render(
      <ChartErrorBoundary>
        <div>chart ok</div>
      </ChartErrorBoundary>,
    );

    expect(screen.getByText("chart ok")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
