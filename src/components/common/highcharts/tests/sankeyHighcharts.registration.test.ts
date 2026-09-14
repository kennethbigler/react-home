const REGISTRATION_ERROR =
  /Highcharts sankey series is not registered\. Check that highcharts-more and modules\/sankey load with the same Highcharts instance as coreHighcharts\./;

vi.mock("highcharts/highcharts-more", () => ({}));
vi.mock("highcharts/modules/sankey", () => ({}));

describe("common | highcharts | sankeyHighcharts | registration", () => {
  it("throws on import when seriesTypes.sankey is missing", async () => {
    vi.resetModules();
    vi.doMock("../coreHighcharts", () => ({
      default: { seriesTypes: {} },
    }));

    await expect(import("../sankeyHighcharts")).rejects.toThrow(
      REGISTRATION_ERROR,
    );
  });

  it("throws on import when seriesTypes.sankey has no prototype", async () => {
    vi.resetModules();
    vi.doMock("../coreHighcharts", () => ({
      default: { seriesTypes: { sankey: {} } },
    }));

    await expect(import("../sankeyHighcharts")).rejects.toThrow(
      REGISTRATION_ERROR,
    );
  });
});
