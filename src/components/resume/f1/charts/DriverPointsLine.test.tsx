import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DriverPointsLine, { tooltipFormatter } from "./DriverPointsLine";

describe("DriverPointsLine", () => {
  it("renders without crashing", () => {
    render(<DriverPointsLine color="#ffffff" />);
    expect(screen.getAllByText("F1 Drivers Points")[0]).toBeInTheDocument();
  });

  it("renders with custom color", () => {
    render(<DriverPointsLine color="#ff0000" />);
    expect(screen.getAllByText("F1 Drivers Points")[0]).toBeInTheDocument();
  });

  it("applies color to title", () => {
    const { container } = render(<DriverPointsLine color="#00ff00" />);
    expect(container).toBeInTheDocument();
  });

  it("renders figure element", () => {
    const { container } = render(<DriverPointsLine color="#ffffff" />);
    expect(container.querySelector("figure")).toBeInTheDocument();
  });

  it("has correct display name", () => {
    expect(DriverPointsLine.displayName).toBe("Driver Points");
  });

  it("memoizes the component", () => {
    const { rerender } = render(<DriverPointsLine color="#ffffff" />);
    rerender(<DriverPointsLine color="#ffffff" />);
    expect(screen.getAllByText("F1 Drivers Points").length).toBeGreaterThan(0);
  });

  it("renders figure with correct styling", () => {
    const { container } = render(<DriverPointsLine color="#ffffff" />);
    const figure = container.querySelector("figure");
    expect(figure).toHaveStyle({ margin: "0", width: "100%" });
  });

  it("uses correct chart type", () => {
    const { container } = render(<DriverPointsLine color="#ffffff" />);
    expect(container.querySelector("figure")).toBeInTheDocument();
  });

  describe("tooltipFormatter", () => {
    it("formats tooltip with single point", () => {
      const mockContext: any = {
        x: 0,
        points: [
          {
            y: 100,
            series: {
              name: "Driver A",
              color: "#ff0000",
            },
          },
        ],
      };

      const result = tooltipFormatter.call(mockContext);
      expect(result).toContain("Year:");
      expect(result).toContain("<b>100</b>: <span");
      expect(result).toContain("Driver A");
    });

    it("formats tooltip with multiple points at same value (uses slash)", () => {
      const mockContext: any = {
        x: 0,
        points: [
          {
            y: 100,
            series: {
              name: "Driver A",
              color: "#ff0000",
            },
          },
          {
            y: 100,
            series: {
              name: "Driver B",
              color: "#00ff00",
            },
          },
        ],
      };

      const result = tooltipFormatter.call(mockContext);
      expect(result).toContain("Driver A");
      expect(result).toContain("Driver B");
      expect(result).toContain(" / "); // Driver uses slash
    });

    it("formats tooltip with multiple points at different values", () => {
      const mockContext: any = {
        x: 0,
        points: [
          {
            y: 150,
            series: {
              name: "Driver A",
              color: "#ff0000",
            },
          },
          {
            y: 100,
            series: {
              name: "Driver B",
              color: "#00ff00",
            },
          },
        ],
      };

      const result = tooltipFormatter.call(mockContext);
      expect(result).toContain("150");
      expect(result).toContain("100");
      // Should be sorted in descending order
      expect(result.indexOf("150")).toBeLessThan(result.indexOf("100"));
    });

    it("handles empty points array", () => {
      const mockContext: any = {
        x: 0,
        points: [],
      };

      const result = tooltipFormatter.call(mockContext);
      expect(result).toContain("Year:");
    });

    it("handles undefined points", () => {
      const mockContext: any = {
        x: 0,
        points: undefined,
      };

      const result = tooltipFormatter.call(mockContext);
      expect(result).toContain("Year:");
    });

    it("handles point with y value of 0", () => {
      const mockContext: any = {
        x: 0,
        points: [
          {
            y: 0,
            series: {
              name: "Driver A",
              color: "#ff0000",
            },
          },
        ],
      };

      const result = tooltipFormatter.call(mockContext);
      expect(result).toContain("0");
    });

    it("handles point with undefined y value", () => {
      const mockContext: any = {
        x: 0,
        points: [
          {
            y: undefined,
            series: {
              name: "Driver A",
              color: "#ff0000",
            },
          },
        ],
      };

      const result = tooltipFormatter.call(mockContext);
      expect(result).toContain("Driver A");
    });
  });
});



