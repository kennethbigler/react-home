import { describe, expect, it } from "vitest";
import type { CarSankeyLink } from "../car-brands";
import { buildCarSankeyFromCars, buildCarSankeyNodes } from "../car-brands";
import { cars, hideFamilyCars, hideKenCars } from "../cars";

const linkKey = (from: string, to: string) => `${from}\0${to}`;

const sankeyLinksToMap = (
  links: ReadonlyArray<CarSankeyLink>,
): Map<string, number> => {
  const weights = new Map<string, number>();
  for (const [from, to, weight] of links) {
    const key = linkKey(from, to);
    weights.set(key, (weights.get(key) ?? 0) + weight);
  }
  return weights;
};

const expectSameSankeyLinks = (
  actual: CarSankeyLink[],
  expected: CarSankeyLink[],
) => {
  expect(sankeyLinksToMap(actual)).toEqual(sankeyLinksToMap(expected));
};

/** Legacy hand-maintained flows — guards against regressions in aggregation. */
const LEGACY_CAR_SANKEY_DATA: CarSankeyLink[] = [
  ["🏎️", "🇩🇪", 2],
  ["🏎️", "🇬🇧", 2],
  ["🏎️", "🇺🇸", 10],
  ["🏎️", "🇯🇵", 2],
  ["🇺🇸", "GM", 4],
  ["🇺🇸", "Stellantis", 1],
  ["🇺🇸", "Ford", 3],
  ["🇺🇸", "Rivian", 1],
  ["🇺🇸", "Tesla", 1],
  ["🇩🇪", "Volkswagen", 2],
  ["🇬🇧", "TATA", 2],
  ["🇯🇵", "Honda", 1],
  ["🇯🇵", "Toyota", 1],
  ["GM", "Chevrolet", 3],
  ["GM", "Pontiac", 1],
  ["Stellantis", "Plymouth", 1],
  ["Volkswagen", "Porsche", 2],
  ["TATA", "Jaguar", 2],
];

const LEGACY_FAMILY_SANKEY_DATA: CarSankeyLink[] = [
  ["🏎️", "🇩🇪", 2],
  ["🏎️", "🇬🇧", 1],
  ["🏎️", "🇺🇸", 6],
  ["🏎️", "🇯🇵", 1],
  ["🇺🇸", "GM", 3],
  ["🇺🇸", "Stellantis", 1],
  ["🇺🇸", "Ford", 1],
  ["🇺🇸", "Tesla", 1],
  ["🇩🇪", "Volkswagen", 2],
  ["🇬🇧", "TATA", 1],
  ["🇯🇵", "Toyota", 1],
  ["GM", "Chevrolet", 3],
  ["Stellantis", "Plymouth", 1],
  ["Volkswagen", "Porsche", 2],
  ["TATA", "Jaguar", 1],
];

const LEGACY_KEN_SANKEY_DATA: CarSankeyLink[] = [
  ["🏎️", "🇩🇪", 1],
  ["🏎️", "🇬🇧", 1],
  ["🏎️", "🇺🇸", 7],
  ["🏎️", "🇯🇵", 1],
  ["🇺🇸", "GM", 3],
  ["🇺🇸", "Ford", 2],
  ["🇺🇸", "Rivian", 1],
  ["🇺🇸", "Tesla", 1],
  ["🇩🇪", "Volkswagen", 1],
  ["🇬🇧", "TATA", 1],
  ["🇯🇵", "Honda", 1],
  ["GM", "Chevrolet", 2],
  ["GM", "Pontiac", 1],
  ["Volkswagen", "Porsche", 1],
  ["TATA", "Jaguar", 1],
];

describe("constants | cars | sankey", () => {
  it("computes all-car flows from the cars array", () => {
    expectSameSankeyLinks(buildCarSankeyFromCars(cars), LEGACY_CAR_SANKEY_DATA);
  });

  it("computes family-only flows when Ken is hidden", () => {
    expectSameSankeyLinks(
      buildCarSankeyFromCars(hideKenCars),
      LEGACY_FAMILY_SANKEY_DATA,
    );
  });

  it("computes Ken-only flows when family is hidden", () => {
    expectSameSankeyLinks(
      buildCarSankeyFromCars(hideFamilyCars),
      LEGACY_KEN_SANKEY_DATA,
    );
  });

  it("builds static node layout from the brand registry", () => {
    expect(buildCarSankeyNodes().find((node) => node.id === "Porsche")).toEqual(
      expect.objectContaining({ column: 3 }),
    );
  });
});
