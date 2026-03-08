import Highcharts from "highcharts/highcharts.src";
import {
  constructorPointsTTFormatter,
  currentPointsTTFormatter,
  driverPointsTTFormatter,
  standingsTTFormatter,
  xAxisLabelFormatter,
} from "../helpers";
import { xAxisYears } from "../../../../../constants/f1";

interface MockPointsContext {
  x: number;
  points?: Array<{
    y?: number;
    series: { name: string; color: string };
  }>;
}

describe("resume | f1 | charts | helpers", () => {
  describe("standingsTTFormatter", () => {
    it("formats tooltip with current point highlighted", () => {
      const mockPoint: Partial<Highcharts.Point> = {
        x: 1,
        y: 5,
        color: "#FF0000",
        series: {
          name: "Test Team",
          data: [
            { x: 0, y: 3 } as Highcharts.Point,
            { x: 1, y: 5 } as Highcharts.Point,
            { x: 2, y: 2 } as Highcharts.Point,
          ],
        } as Highcharts.Series,
      };

      const result = standingsTTFormatter.call(mockPoint as Highcharts.Point);

      expect(result).toContain(`Year: <b>${xAxisYears[1]}</b>`);
      expect(result).toContain("<b>5</b>");
      expect(result).toContain("Test Team");
      expect(result).toContain("#FF0000");
    });

    it("handles points with no y value", () => {
      const mockPoint: Partial<Highcharts.Point> = {
        x: 0,
        y: 1,
        color: "#00FF00",
        series: {
          name: "Another Team",
          data: [
            { x: 0, y: 1 } as unknown as Highcharts.Point,
            { x: 1, y: null } as unknown as Highcharts.Point,
            { x: 2, y: 4 } as unknown as Highcharts.Point,
          ],
        } as Highcharts.Series,
      };

      const result = standingsTTFormatter.call(mockPoint as Highcharts.Point);

      expect(result).toContain(`Year: <b>${xAxisYears[0]}</b>`);
      expect(result).toContain("-");
      expect(result).toContain("Another Team");
    });

    it("formats tooltip with all points in series", () => {
      const mockPoint: Partial<Highcharts.Point> = {
        x: 2,
        y: 10,
        color: "#0000FF",
        series: {
          name: "Final Team",
          data: [
            { x: 0, y: 8 } as Highcharts.Point,
            { x: 1, y: 9 } as Highcharts.Point,
            { x: 2, y: 10 } as Highcharts.Point,
          ],
        } as Highcharts.Series,
      };

      const result = standingsTTFormatter.call(mockPoint as Highcharts.Point);

      expect(result).toContain("8");
      expect(result).toContain("9");
      expect(result).toContain("<b>10</b>");
      expect(result).toContain("Final Team");
    });
  });

  describe("xAxisLabelFormatter", () => {
    it("returns year string for point value", () => {
      const ctx0 = { value: 0 } as Highcharts.AxisLabelsFormatterContextObject;
      const ctx1 = { value: 1 } as Highcharts.AxisLabelsFormatterContextObject;
      expect(xAxisLabelFormatter.call(ctx0, ctx0)).toBe(
        xAxisYears[0].toString(),
      );
      expect(xAxisLabelFormatter.call(ctx1, ctx1)).toBe(
        xAxisYears[1].toString(),
      );
    });
  });

  describe("constructorPointsTTFormatter", () => {
    it("formats with year line and parentheses for same value", () => {
      const mockContext: MockPointsContext = {
        x: 0,
        points: [
          { y: 100, series: { name: "Team A", color: "#f00" } },
          { y: 100, series: { name: "Team B", color: "#0f0" } },
        ],
      };
      const result = constructorPointsTTFormatter.call(
        mockContext as Highcharts.Point,
      );
      expect(result).toContain("Year:");
      expect(result).toContain(" (");
      expect(result).toContain("Team A");
      expect(result).toContain("Team B");
    });
  });

  describe("driverPointsTTFormatter", () => {
    it("formats with year line and slash for same value", () => {
      const mockContext: MockPointsContext = {
        x: 0,
        points: [
          { y: 100, series: { name: "Driver A", color: "#f00" } },
          { y: 100, series: { name: "Driver B", color: "#0f0" } },
        ],
      };
      const result = driverPointsTTFormatter.call(
        mockContext as Highcharts.Point,
      );
      expect(result).toContain("Year:");
      expect(result).toContain(" / ");
      expect(result).toContain("Driver A");
      expect(result).toContain("Driver B");
    });
  });

  describe("currentPointsTTFormatter", () => {
    it("formats without year line and with slash", () => {
      const mockContext: MockPointsContext = {
        x: 0,
        points: [
          { y: 50, series: { name: "Entry A", color: "#f00" } },
          { y: 50, series: { name: "Entry B", color: "#0f0" } },
        ],
      };
      const result = currentPointsTTFormatter.call(
        mockContext as Highcharts.Point,
      );
      expect(result).not.toContain("Year:");
      expect(result).toContain(" / ");
      expect(result).toContain("Entry A");
      expect(result).toContain("Entry B");
    });
  });
});
