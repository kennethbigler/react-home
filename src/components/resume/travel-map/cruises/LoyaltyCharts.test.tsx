import "../../../common/highcharts/tests/highchartsMocks";
import { screen } from "@testing-library/react";
import themeAtom, { lightTheme } from "@/jotai/theme-atom";
import { loyaltySeries } from "@/constants/cruises";
import { renderWithHydratedAtoms } from "@/test-utils/renderWithHydratedAtoms";
import LoyaltyCharts from "./LoyaltyCharts";

describe("resume | travel-map | cruises | LoyaltyCharts", () => {
  it("renders the cruise loyalty chart", () => {
    renderWithHydratedAtoms(<LoyaltyCharts />);

    expect(screen.getByText("Cruise Loyalty")).toBeInTheDocument();
    expect(screen.getAllByTestId("highcharts-series")).toHaveLength(
      loyaltySeries.length,
    );
  });

  it("renders in light mode", () => {
    renderWithHydratedAtoms(<LoyaltyCharts />, [
      [themeAtom, lightTheme] as const,
    ]);

    expect(screen.getByText("Cruise Loyalty")).toBeInTheDocument();
  });
});
