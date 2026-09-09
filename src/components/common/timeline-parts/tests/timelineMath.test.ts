import { describe, expect, it } from "vitest";
import dateObj from "@/apis/DateHelper";
import { contractData } from "@/constants/f1";
import { cars } from "@/constants/cars";
import {
  getTimelineRange,
  getTimelineRows,
  getYearMarkers,
} from "@/components/resume/f1/timeline-card/timelineHelpers";
import {
  getCarsTimelineRange,
  getSegments,
  getYearMarkers as getCarYearMarkers,
} from "@/components/resume/cars/timeline-card/timelineHelpers";
import {
  TIMELINE_WIDTH,
  buildYearMarkerSegments,
  finalizeRowWidths,
  positionOnTimeline,
  widthBetween,
} from "../timelineMath";

const sumWidths = (segments: { width: number }[]) =>
  segments.reduce((total, segment) => total + segment.width, 0);

describe("common | timeline-parts | timelineMath", () => {
  it("keeps year marker rows at exactly TIMELINE_WIDTH", () => {
    const range = {
      start: dateObj("2008-03"),
      end: dateObj("2026-09"),
    };
    const markers = buildYearMarkerSegments(range, [
      { date: dateObj("2011"), label: "'11" },
      { date: dateObj("2014"), label: "'14" },
      { date: dateObj("2017"), label: "'17" },
      { date: dateObj("2020"), label: "'20" },
      { date: dateObj("2023"), label: "'23" },
      { date: dateObj("2026"), label: "'26" },
    ]);

    expect(sumWidths(markers)).toBe(TIMELINE_WIDTH);
  });

  it("absorbs floating-point drift in finalizeRowWidths", () => {
    const widths = finalizeRowWidths([33.3333, 33.3333, 33.3333]);
    expect(sumWidths(widths.map((width) => ({ width })))).toBe(TIMELINE_WIDTH);
  });

  it("keeps F1 contract rows aligned to the same width as year markers", () => {
    const range = getTimelineRange(contractData);
    expect(range).toBeDefined();
    if (!range) {
      return;
    }

    const yearMarkers = getYearMarkers(range);
    const rows = getTimelineRows(contractData, range);

    expect(sumWidths(yearMarkers)).toBe(TIMELINE_WIDTH);
    rows.forEach((row) => {
      expect(sumWidths(row.segments)).toBe(TIMELINE_WIDTH);
    });
  });

  it("places Antonelli between the 2025 and 2027 year markers on the F1 timeline", () => {
    const range = getTimelineRange(contractData);
    expect(range).toBeDefined();
    if (!range) {
      return;
    }

    const antonelli = contractData.find(
      (contract) => contract.team === "Mercedes - Antonelli",
    );
    expect(antonelli).toBeDefined();
    if (!antonelli) {
      return;
    }

    const start = positionOnTimeline(antonelli.start, range);
    const end = positionOnTimeline(antonelli.end, range);
    const marker2025 = positionOnTimeline(dateObj("2025"), range);
    const marker2027 = positionOnTimeline(dateObj("2027"), range);

    expect(start).toBeCloseTo(marker2025, 1);
    expect(end).toBeGreaterThan(positionOnTimeline(dateObj("2026"), range));
    expect(end).toBeLessThan(marker2027);
  });

  it("keeps Cayenne shorter than longer-running current cars on the cars timeline", () => {
    const range = getCarsTimelineRange();
    const cayenne = cars.find((car) => car.car === "Cayenne");
    const equinox = cars.find((car) => car.car === "Equinox");

    expect(cayenne).toBeDefined();
    expect(equinox).toBeDefined();
    if (!cayenne || !equinox) {
      return;
    }

    const cayenneWidth = widthBetween(cayenne.start, cayenne.end, range);
    const equinoxWidth = widthBetween(equinox.start, equinox.end, range);

    expect(cayenneWidth).toBeLessThan(equinoxWidth);
  });

  it("keeps packed car rows at exactly TIMELINE_WIDTH", () => {
    const range = getCarsTimelineRange();
    const added = new Array(cars.length).fill(false);
    const rowWidths = cars
      .map((car, index) =>
        getSegments(cars, added, false, false, car, index, range),
      )
      .filter((segments) => segments.length > 0)
      .map(sumWidths);

    rowWidths.forEach((total) => {
      expect(total).toBe(TIMELINE_WIDTH);
    });
  });

  it("keeps car year markers aligned with car segment rows", () => {
    const range = getCarsTimelineRange();
    expect(sumWidths(getCarYearMarkers(range))).toBe(TIMELINE_WIDTH);
  });
});
