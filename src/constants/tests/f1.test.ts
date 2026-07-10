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

      expect(data.length, `${name}`).toBe(standings?.length);
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

      expect(points, `${name} points`).toHaveLength(xAxisYears.length);
      expect(standings, `${name} standings`).toHaveLength(xAxisYears.length);
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
        expect(data[i], `${name} race ${i}`).toBeGreaterThanOrEqual(
          data[i - 1] ?? 0,
        );
      }

      const seasonPoints = driverPointsData
        .find((entry) => entry.name === name)
        ?.data.at(-1);

      if (typeof seasonPoints === "number") {
        expect(data.at(-1), `${name} season total`).toBe(seasonPoints);
      }
    });
  });
});
