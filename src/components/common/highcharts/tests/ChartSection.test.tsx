import { render, screen } from "@testing-library/react";
import ChartSection from "../ChartSection";

describe("common | highcharts | ChartSection", () => {
  it("renders children", () => {
    render(
      <ChartSection>
        <div>charts</div>
      </ChartSection>,
    );

    expect(screen.getByText("charts")).toBeInTheDocument();
  });
});
