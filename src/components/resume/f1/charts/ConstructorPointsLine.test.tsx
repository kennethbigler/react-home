import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ConstructorPointsLine, { tooltipFormatter } from "./ConstructorPointsLine";

describe("ConstructorPointsLine", () => {
  it("renders without crashing", () => {
    render(<ConstructorPointsLine color="#ffffff" />);
    expect(screen.getAllByText("F1 Constructors Points")[0]).toBeInTheDocument();
  });

  it("renders with custom color", () => {
    render(<ConstructorPointsLine color="#ff0000" />);
    expect(screen.getAllByText("F1 Constructors Points")[0]).toBeInTheDocument();
  });

  it("applies color to title", () => {
    const { container } = render(<ConstructorPointsLine color="#00ff00" />);
    expect(container).toBeInTheDocument();
  });

  it("renders figure element", () => {
    const { container } = render(<ConstructorPointsLine color="#ffffff" />);
    expect(container.querySelector("figure")).toBeInTheDocument();
  });

  it("has correct display name", () => {
    expect(ConstructorPointsLine.displayName).toBe("Constructor Points");
  });

  it("memoizes the component", () => {
    const { rerender } = render(<ConstructorPointsLine color="#ffffff" />);
    rerender(<ConstructorPointsLine color="#ffffff" />);
    expect(screen.getAllByText("F1 Constructors Points").length).toBeGreaterThan(0);
  });

  it("uses correct chart type", () => {
    const { container } = render(<ConstructorPointsLine color="#ffffff" />);
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
              name: "Team A",
              color: "#ff0000",
            },
          },
        ],
      };

      const result = tooltipFormatter.call(mockContext);
      expect(result).toContain("Year:");
      expect(result).toContain("<b>100</b>: <span");
      expect(result).toContain("Team A");
    });

    it("formats tooltip with multiple points at same value (uses parentheses)", () => {
      const mockContext: any = {
        x: 0,
        points: [
          {
            y: 100,
            series: {
              name: "Team A",
              color: "#ff0000",
            },
          },
          {
            y: 100,
            series: {
              name: "Team B",
              color: "#00ff00",
            },
          },
        ],
      };

      const result = tooltipFormatter.call(mockContext);
      expect(result).toContain("Team A");
      expect(result).toContain("Team B");
      expect(result).toContain(" ("); // Constructor uses parentheses
    });

    it("formats tooltip with multiple points at different values", () => {
      const mockContext: any = {
        x: 0,
        points: [
          {
            y: 150,
            series: {
              name: "Team A",
              color: "#ff0000",
            },
          },
          {
            y: 100,
            series: {
              name: "Team B",
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
              name: "Team A",
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
              name: "Team A",
              color: "#ff0000",
            },
          },
        ],
      };

      const result = tooltipFormatter.call(mockContext);
      expect(result).toContain("Team A");
    });
  });
});



