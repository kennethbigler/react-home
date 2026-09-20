const setHighcharts = vi.fn();

vi.mock("@highcharts/react", () => ({
  setHighcharts,
}));

vi.mock("highcharts/esm/highmaps.src.js", () => ({
  default: { __mapsBrand: "highmaps" },
}));

vi.mock("highcharts/esm/modules/accessibility.src.js", () => ({
  default: vi.fn(),
}));

describe("common | highcharts | mapsHighcharts", () => {
  it("registers the maps Highcharts instance with @highcharts/react", async () => {
    vi.resetModules();
    setHighcharts.mockClear();

    const mod = await import("../mapsHighcharts");

    expect(setHighcharts).toHaveBeenCalledWith({ __mapsBrand: "highmaps" });
    expect(mod.default).toEqual({ __mapsBrand: "highmaps" });
  });
});
