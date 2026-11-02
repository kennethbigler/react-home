import { assert, describe, it } from "vitest";
import {
  constructorPointsData,
  constructorStandingsData,
  driverPointsData,
  driverStandingsData,
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

  it("keeps points and standings the same length for every constructor", () => {
    constructorPointsData.forEach(({ name, data }) => {
      const standings = constructorStandingsData.find(
        (entry) => entry.name === name,
      )?.data;

      assert(data.length === standings?.length, `${name}`);
    });
  });
});
