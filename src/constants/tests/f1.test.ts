import { assert, describe, expect, it } from "vitest";
import {
  constructorCurrentData,
  constructorPointsData,
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
        const current = data[i];
        const previous = data[i - 1];

        assert(
          typeof current === "number" && typeof previous === "number",
          `${name} race ${i}`,
        );
        assert(current >= previous, `${name} race ${i}`);
      }

      const seasonPoints = driverPointsData
        .find((entry) => entry.name === name)
        ?.data.at(-1);

      if (typeof seasonPoints === "number") {
        assert(data.at(-1) === seasonPoints, `${name} season total`);
      }
    });
  });

  it("assigns substitute points to the constructor that fielded the car", () => {
    const current = (
      name: string,
      entries: { name: string; data: unknown[] }[],
    ) => entries.find((entry) => entry.name === name)?.data as number[];

    const verstappen = current("Max Verstappen", driverCurrentData);
    const hadjar = current("Isack Hadjar", driverCurrentData);
    const lawson = current("Liam Lawson", driverCurrentData);
    const lindblad = current("Arvid Lindblad", driverCurrentData);
    const tsunoda = current("Yuki Tsunoda", driverCurrentData);
    const redBull = current("Red Bull Racing", constructorCurrentData);
    const racingBulls = current("Racing Bulls", constructorCurrentData);

    expect(redBull[11]).toBe(verstappen[11] + hadjar[11]);
    expect(redBull[12]).toBe(verstappen[12] + hadjar[12] + 6);
    expect(redBull[13]).toBe(verstappen[13] + hadjar[13] + 6);
    expect(redBull.at(-1)).toBe(verstappen.at(-1)! + hadjar.at(-1)! + 14);

    expect(racingBulls[11]).toBe(lawson[11] + lindblad[11] + tsunoda[11]);
    expect(racingBulls[12]).toBe(lawson[12] + lindblad[12] + tsunoda[12] - 6);
    expect(racingBulls[13]).toBe(lawson[13] + lindblad[13] + tsunoda[13] - 6);
    expect(racingBulls.at(-1)).toBe(
      lawson.at(-1)! + lindblad.at(-1)! + tsunoda.at(-1)! - 14,
    );

    const seasonTotal = (name: string) =>
      constructorPointsData.find((entry) => entry.name === name)?.data.at(-1);

    expect(redBull.at(-1)).toBe(seasonTotal("Red Bull Racing"));
    expect(racingBulls.at(-1)).toBe(seasonTotal("Racing Bulls"));
  });
});
