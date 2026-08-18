import { assert, describe, expect, it } from "vitest";
import {
  driverCurrentData,
  driverPointsData,
  driverStandingsData,
  xAxisYears,
} from "../f1";

describe("constants | f1", () => {
  it("keeps points and standings the same length for every driver", () => {
    driverPointsData.forEach(({ name, data }) => {
      const standings = driverStandingsData.find(
        (entry) => entry.name === name,
      )?.data;

      assert(data.length === standings?.length, `${name}`);
    });
  });

  it("aligns current-season driver history with xAxisYears", () => {
    driverCurrentData.forEach(({ name }) => {
      const points = driverPointsData.find(
        (entry) => entry.name === name,
      )?.data;
      const standings = driverStandingsData.find(
        (entry) => entry.name === name,
      )?.data;

      assert(points?.length === xAxisYears.length, `${name} points`);
      assert(standings?.length === xAxisYears.length, `${name} standings`);
    });
  });

  it("keeps current-season driver arrays aligned with each other", () => {
    const raceCounts = driverCurrentData.map(({ data }) => data.length);
    const uniqueCounts = new Set(raceCounts);

    expect(uniqueCounts.size).toBe(1);
    expect(raceCounts[0]).toBeGreaterThan(0);
  });

  it("keeps thisYear totals non-decreasing and aligned with season points", () => {
    driverCurrentData.forEach(({ name, data }) => {
      for (let i = 1; i < data.length; i += 1) {
        assert((data[i] ?? 0) >= (data[i - 1] ?? 0), `${name} race ${i}`);
      }

      const seasonPoints = driverPointsData
        .find((entry) => entry.name === name)
        ?.data.at(-1);

      if (typeof seasonPoints === "number") {
        assert(data.at(-1) === seasonPoints, `${name} season total`);
      }
    });
  });
});
