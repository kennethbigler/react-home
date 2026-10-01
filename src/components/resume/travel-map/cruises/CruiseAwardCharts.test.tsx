import "../../../common/highcharts/tests/highchartsMocks";
import { screen } from "@testing-library/react";
import { createTheme } from "@mui/material/styles";
import themeAtom, { lightTheme } from "@/jotai/theme-atom";
import { cruiseAwardCharts } from "@/constants/cruise-awards";
import { renderWithHydratedAtoms } from "@/test-utils/renderWithHydratedAtoms";
import {
  formatTooltip,
  getSeriesByName,
} from "@/components/common/highcharts/tests/highchartsMocks";
import CruiseAwardCharts from "./CruiseAwardCharts";

describe("resume | travel-map | cruises | CruiseAwardCharts", () => {
  it("renders each Cruise Critic standings chart", () => {
    renderWithHydratedAtoms(<CruiseAwardCharts />);

    cruiseAwardCharts.forEach((chart) => {
      expect(screen.getByText(chart.title)).toBeInTheDocument();
      expect(screen.getByText(chart.caption)).toBeInTheDocument();
    });

    expect(screen.getAllByTestId("highcharts-series")).toHaveLength(
      cruiseAwardCharts.reduce((sum, chart) => sum + chart.series.length, 0),
    );
    expect(CruiseAwardCharts.displayName).toBe("CruiseAwardCharts");
  });

  it("uses the theme text color for chart text in light mode", () => {
    renderWithHydratedAtoms(<CruiseAwardCharts />, [
      [themeAtom, lightTheme] as const,
    ]);

    expect(screen.getAllByText("Best Ocean Cruise Line")[0]).toHaveStyle({
      color: createTheme({ palette: { mode: "light" } }).palette.text.primary,
    });
  });

  it("highlights the hovered year in the standings tooltip", () => {
    renderWithHydratedAtoms(<CruiseAwardCharts />);

    const aqua = getSeriesByName("Aqua Expeditions");
    expect(aqua?.data).toEqual([null, 1]);

    const tooltip = formatTooltip({
      x: 1,
      y: 1,
      color: "#00A3A1",
      series: {
        name: "Aqua Expeditions",
        options: { custom: { award: "cruisers" } },
        data: [
          { x: 0, y: null },
          { x: 1, y: 1 },
        ],
      },
    } as never);

    expect(tooltip).toContain("2025");
    expect(tooltip).toContain("Aqua Expeditions");
    expect(tooltip).toContain("Cruisers' Choice");
    expect(tooltip).toContain("<b>1</b>");

    const editorsTip = formatTooltip({
      x: 0,
      y: 0,
      color: "#FFCC00",
      series: {
        name: "Lindblad Expeditions",
        options: { custom: { award: "editors" } },
        data: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
        ],
      },
    } as never);

    expect(editorsTip).toContain("2024");
    expect(editorsTip).toContain("Editors' Pick");
    expect(editorsTip).toContain("<b>0</b>");
  });
});
