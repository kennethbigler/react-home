const REGISTRATION_WARN =
  /Highcharts sankey series is not registered\. Check that highcharts-more and modules\/sankey load with the same Highcharts instance as coreHighcharts\./;

vi.mock("highcharts/esm/highcharts-more.src.js", () => ({}));
vi.mock("highcharts/esm/modules/sankey.src.js", () => ({}));

describe("common | highcharts | sankeyHighcharts | registration", () => {
  it("imports without throwing when seriesTypes.sankey is missing", async () => {
    vi.resetModules();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.doMock("../coreHighcharts", () => ({
      default: { seriesTypes: {} },
    }));

    await expect(import("../sankeyHighcharts")).resolves.toBeDefined();
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(REGISTRATION_WARN));
    warn.mockRestore();
  });

  it("imports without throwing when seriesTypes.sankey has no prototype", async () => {
    vi.resetModules();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.doMock("../coreHighcharts", () => ({
      default: { seriesTypes: { sankey: {} } },
    }));

    await expect(import("../sankeyHighcharts")).resolves.toBeDefined();
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(REGISTRATION_WARN));
    warn.mockRestore();
  });
});
