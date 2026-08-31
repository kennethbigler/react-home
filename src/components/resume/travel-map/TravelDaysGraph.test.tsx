import "../../common/highcharts/tests/highchartsMocks";
import { screen } from "@testing-library/react";
import themeAtom, { lightTheme } from "@/jotai/theme-atom";
import { vacationDays, workDays } from "@/constants/travel";
import { renderWithHydratedAtoms } from "@/test-utils/renderWithHydratedAtoms";
import TravelDaysGraph from "./TravelDaysGraph";

describe("resume | travel-map | TravelDaysGraph", () => {
  it("renders the travel days chart", () => {
    renderWithHydratedAtoms(<TravelDaysGraph />);

    expect(screen.getByText("Travel Days")).toBeInTheDocument();
    expect(screen.getByTestId("highcharts-chart")).toBeInTheDocument();
    expect(screen.getAllByTestId("highcharts-series")).toHaveLength(2);
    expect(screen.getAllByTestId("highcharts-series")[0]).toHaveAttribute(
      "data-length",
      String(vacationDays.length),
    );
    expect(screen.getAllByTestId("highcharts-series")[1]).toHaveAttribute(
      "data-length",
      String(workDays.length),
    );
  });

  it("renders in light mode", () => {
    renderWithHydratedAtoms(<TravelDaysGraph />, [
      [themeAtom, lightTheme] as const,
    ]);

    expect(screen.getByText("Travel Days")).toBeInTheDocument();
  });
});
