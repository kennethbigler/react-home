import { describe, expect, it } from "vitest";
import { cruiseAwardCharts } from "../cruise-awards";

const placesInYear = (
  chart: (typeof cruiseAwardCharts)[number],
  yearIndex: number,
) =>
  chart.series
    .map((series) => series.data[yearIndex])
    .filter((rank): rank is number => typeof rank === "number")
    .sort((a, b) => a - b);

const placesFor = (id: string, year: number) => {
  const chart = cruiseAwardCharts.find((entry) => entry.id === id);
  if (!chart) throw new Error(id);
  return placesInYear(chart, chart.years.indexOf(year));
};

describe("constants | cruise-awards", () => {
  it("aligns every series with its chart years and uses a brand color", () => {
    cruiseAwardCharts.forEach((chart) => {
      expect(chart.years[0]).toBeGreaterThanOrEqual(2023);
      expect(chart.ranks[0]).toBe(0);
      expect(
        new Set(chart.series.map((series) => `${series.name}:${series.award}`))
          .size,
      ).toBe(chart.series.length);

      chart.series.forEach((series) => {
        expect(series.data).toHaveLength(chart.years.length);
        expect(series.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
        series.data.forEach((rank) => {
          if (typeof rank !== "number") return;
          if (series.award === "editors") {
            expect(rank).toBe(0);
          } else {
            expect(rank).toBeGreaterThanOrEqual(1);
            expect(rank).toBeLessThanOrEqual(3);
          }
        });
      });
    });
  });

  it("puts the editors' pick at 0 and Cruisers' Choice at 1–3", () => {
    expect(placesFor("ocean", 2023)).toEqual([1, 2, 3]);
    expect(placesFor("ocean", 2024)).toEqual([0, 1, 2, 3]);
    expect(placesFor("ocean", 2025)).toEqual([0, 1, 2, 3]);

    expect(placesFor("luxury", 2023)).toEqual([0]);
    expect(placesFor("luxury", 2024)).toEqual([0, 1, 2, 3]);

    expect(placesFor("river", 2023)).toEqual([0, 1, 2, 3]);

    expect(placesFor("expedition", 2024)).toEqual([0, 1, 2, 3]);
    expect(placesFor("expedition", 2025)).toEqual([0, 1, 2, 3]);

    expect(placesFor("families", 2023)).toEqual([0]);
    expect(placesFor("families", 2025)).toEqual([0]);
    expect(placesFor("value", 2023)).toEqual([0]);
    expect(placesFor("value", 2025)).toEqual([0]);
  });

  it("keeps both places when one line wins the editors' pick and a Cruisers' Choice rank", () => {
    expect(placesFor("ocean", 2025)).toContain(0);
    expect(placesFor("ocean", 2025)).toContain(2);
    expect(placesFor("luxury", 2025)).toEqual([0, 1, 2, 3]);
    expect(placesFor("river", 2023)).toEqual([0, 1, 2, 3]);
    expect(placesFor("expedition", 2024)).toEqual([0, 1, 2, 3]);
  });
});
