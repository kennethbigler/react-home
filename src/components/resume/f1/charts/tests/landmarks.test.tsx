import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ConstructorPointsLine from "../ConstructorPointsLine";
import ConstructorStandingsLine from "../ConstructorStandingsLine";

// Regression: axe landmark-unique on /f1. Both charts share series names
// (e.g. "Ferrari"), so series must not be exposed as region landmarks.
describe("F1 charts | landmarks", () => {
  it("does not expose series as region landmarks", () => {
    const { container } = render(
      <>
        <ConstructorPointsLine color="#ffffff" />
        <ConstructorStandingsLine color="#ffffff" />
      </>,
    );

    const seriesRoles = Array.from(
      container.querySelectorAll(
        ".highcharts-series[role], .highcharts-markers[role]",
      ),
      (el) => el.getAttribute("role"),
    );

    expect(seriesRoles.length).toBeGreaterThan(0);
    expect(seriesRoles).not.toContain("region");
  });

  it("gives every region landmark a unique accessible name", () => {
    const { container } = render(
      <>
        <ConstructorPointsLine color="#ffffff" />
        <ConstructorStandingsLine color="#ffffff" />
      </>,
    );

    const labels = Array.from(
      container.querySelectorAll('[role="region"]'),
      (el) => el.getAttribute("aria-label"),
    );

    expect(labels.length).toBeGreaterThan(0);
    expect(new Set(labels).size).toBe(labels.length);
  });
});
