import "@/components/common/highcharts/tests/highchartsMocks";
import { render, screen } from "@testing-library/react";
import StatsBagsChart from "./StatsBagsChart";

describe("games | spades | StatsBagsChart", () => {
  const props = {
    initials: "ABCD",
    lifeBags: [1, 2, 3, 4, 5] as [number, number, number, number, number],
    missedBids: [0, 1, 0, 2] as [number, number, number, number],
    color: "black",
  };

  it("renders the bags chart title", () => {
    render(<StatsBagsChart {...props} />);
    expect(screen.getByText("Bags")).toBeInTheDocument();
    expect(screen.getByTestId("highcharts-chart")).toBeInTheDocument();
  });

  it("renders a figure wrapper", () => {
    const { container } = render(<StatsBagsChart {...props} />);
    expect(container.querySelector("figure")).toBeInTheDocument();
  });
});
