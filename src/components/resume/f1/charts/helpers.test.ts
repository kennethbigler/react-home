import Highcharts from "highcharts/highcharts.src";
import { standingsTTFormatter } from "./helpers";
import { xAxisYears } from "../../../../constants/f1";

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
});
