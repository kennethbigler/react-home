import "@/components/common/highcharts/tests/highchartsMocks";
import { render, screen } from "@testing-library/react";
import StatsNilChart from "./StatsNilsChart";
import type { NilMetrics } from "@/jotai/spades-atom";

describe("games | spades | StatsNilsChart", () => {
  const nils: NilMetrics = [
    [2, 1, 3],
    [1, 0, 2],
    [3, 1, 1],
    [0, 0, 4],
  ];

  it("renders the nils chart title", () => {
    render(<StatsNilChart color="white" initials="ABCD" nils={nils} />);
    expect(screen.getByText("Nils")).toBeInTheDocument();
    expect(screen.getByTestId("highcharts-chart")).toBeInTheDocument();
  });

  it("renders a figure wrapper", () => {
    const { container } = render(
      <StatsNilChart color="black" initials="WXYZ" nils={nils} />,
    );
    expect(container.querySelector("figure")).toBeInTheDocument();
  });
});
