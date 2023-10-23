import { tooltipFormatter } from "../job-helpers";

const entry = {
  name: "months1",
  value: "6",
  payload: {
    name: "months2",
  },
};

describe("resume | work | TechBarChart", () => {
  test("tooltipFormatter", () => {
    expect(tooltipFormatter(6, "months-test", entry)).toEqual([
      "6m",
      "months2",
    ]);
    expect(tooltipFormatter(12, "months-test", entry)).toEqual([
      "1y ",
      "months2",
    ]);
    expect(tooltipFormatter(18, "months-test", entry)).toEqual([
      "1y 6m",
      "months2",
    ]);
  });
});
