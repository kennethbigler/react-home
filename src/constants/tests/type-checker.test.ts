import { TYPE_CHARTS, TYPE_INTRODUCED } from "../pokemon-type-charts";
import { GENERATIONS, getGenerationChart, types } from "../type-checker";

/** attacker vs defender multiplier by name */
const matchup = (generation: number, atk: string, def: string) => {
  const chart = getGenerationChart(generation);
  const idx = (name: string) => chart.types.findIndex((t) => t.name === name);
  return chart.effectiveness[idx(atk)][idx(def)];
};

describe("constants | type-checker", () => {
  it("keeps generated data aligned with types", () => {
    expect(TYPE_INTRODUCED).toHaveLength(types.length);
    TYPE_CHARTS.forEach(({ effectiveness }) => {
      expect(effectiveness).toHaveLength(types.length);
    });
  });

  it("labels one option per chart", () => {
    expect(GENERATIONS).toEqual([
      { value: 1, label: "Generation I" },
      { value: 2, label: "Generation II–V" },
      { value: 6, label: "Generation VI–IX" },
    ]);
  });

  it("lists only the types that existed", () => {
    expect(getGenerationChart(1).types).toHaveLength(15);
    expect(getGenerationChart(3).types).toHaveLength(17);
    expect(getGenerationChart(9).types).toHaveLength(18);
    expect(getGenerationChart(3).value).toBe(2);
  });

  it("uses past matchups", () => {
    expect(matchup(1, "ghost", "psychic")).toBe(0);
    expect(matchup(2, "ghost", "psychic")).toBe(2);
    expect(matchup(1, "bug", "poison")).toBe(2);
    expect(matchup(5, "dark", "steel")).toBe(0.5);
    expect(matchup(6, "dark", "steel")).toBe(1);
  });

  it("falls back to the latest chart", () => {
    expect(getGenerationChart(99)).toEqual(getGenerationChart(9));
  });
});
