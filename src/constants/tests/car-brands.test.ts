import { describe, expect, it } from "vitest";
import { cars } from "../cars";
import { buildCarSankeyFromCars, buildCarSankeyNodes } from "../car-brands";

describe("constants | car-brands", () => {
  it("throws for an unknown title prefix", () => {
    expect(() => buildCarSankeyFromCars([{ title: "Title 1" }])).toThrow(
      'Unknown car brand "Title"',
    );
  });

  it("builds a 4-tier path for Chevrolet", () => {
    expect(
      buildCarSankeyFromCars([{ title: "Chevrolet Impala LS (2010)" }]),
    ).toEqual([
      ["🏎️", "🇺🇸", 1],
      ["🇺🇸", "GM", 1],
      ["GM", "Chevrolet", 1],
    ]);
  });

  it("builds a 3-tier path for Ford", () => {
    expect(
      buildCarSankeyFromCars([{ title: "Ford Mustang GT Premium (2015)" }]),
    ).toEqual([
      ["🏎️", "🇺🇸", 1],
      ["🇺🇸", "Ford", 1],
    ]);
  });

  it("aggregates duplicate flows from multiple cars", () => {
    const data = buildCarSankeyFromCars([
      { title: "Ford Mustang GT Premium (2015)" },
      { title: "Ford Bronco Badlands (2021)" },
      { title: "Chevrolet Impala LS (2010)" },
    ]);

    expect(data).toContainEqual(["🏎️", "🇺🇸", 3]);
    expect(data).toContainEqual(["🇺🇸", "Ford", 2]);
    expect(data).toContainEqual(["🇺🇸", "GM", 1]);
    expect(data).toContainEqual(["GM", "Chevrolet", 1]);
  });

  it("builds sankey nodes for every registry tier", () => {
    const nodes = buildCarSankeyNodes();

    expect(nodes.find((node) => node.id === "🏎️")).toMatchObject({
      column: 0,
    });
    expect(nodes.find((node) => node.id === "🇯🇵")).toMatchObject({
      column: 1,
    });
    expect(nodes.find((node) => node.id === "GM")).toMatchObject({ column: 2 });
    expect(nodes.find((node) => node.id === "Honda")).toMatchObject({
      column: 3,
    });
  });

  it("parses every car title in the fleet", () => {
    expect(() => buildCarSankeyFromCars(cars)).not.toThrow();
  });
});
