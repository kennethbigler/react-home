import "../../../common/highcharts/tests/highchartsMocks";
import { screen } from "@testing-library/react";
import themeAtom, { lightTheme } from "@/jotai/theme-atom";
import { cruiseData } from "@/constants/cruises";
import { renderWithHydratedAtoms } from "@/test-utils/renderWithHydratedAtoms";
import CruiseSankeyGraph from "./CruiseSankeyGraph";

describe("resume | travel-map | cruises | CruiseSankeyGraph", () => {
  it("renders the cruise sankey chart", () => {
    renderWithHydratedAtoms(<CruiseSankeyGraph />);

    expect(screen.getByText("Cruises")).toBeInTheDocument();
    expect(screen.getByTestId("highcharts-series")).toHaveAttribute(
      "data-length",
      String(cruiseData.data.length),
    );
    expect(screen.getByTestId("highcharts-series")).toHaveAttribute(
      "data-type",
      "sankey",
    );
  });

  it("renders in light mode", () => {
    renderWithHydratedAtoms(<CruiseSankeyGraph />, [
      [themeAtom, lightTheme] as const,
    ]);

    expect(screen.getByText("Cruises")).toBeInTheDocument();
  });
});
