import { describe, expect, it } from "vitest";
import { formatCompactAxisCurrency } from "./chartHelpers";

describe("chartHelpers | formatCompactAxisCurrency", () => {
  it("formats thousands and millions with $ prefix", () => {
    expect(formatCompactAxisCurrency(500_000)).toBe("$500k");
    expect(formatCompactAxisCurrency(1_000_000)).toBe("$1M");
    expect(formatCompactAxisCurrency(1_500_000)).toBe("$1.5M");
    expect(formatCompactAxisCurrency(2_000_000)).toBe("$2M");
    expect(formatCompactAxisCurrency(2_500_000)).toBe("$2.5M");
  });

  it("formats billions with $ prefix", () => {
    expect(formatCompactAxisCurrency(1_000_000_000)).toBe("$1B");
    expect(formatCompactAxisCurrency(1_500_000_000)).toBe("$1.5B");
    expect(formatCompactAxisCurrency(2_500_000_000)).toBe("$2.5B");
  });

  it("promotes million-scale values that round to 1000M to billions", () => {
    expect(formatCompactAxisCurrency(999_500_000)).toBe("$1B");
    expect(formatCompactAxisCurrency(999_999_999)).toBe("$1B");
  });

  it("promotes thousand-scale values that round to 1000k to millions", () => {
    expect(formatCompactAxisCurrency(999_500)).toBe("$1M");
    expect(formatCompactAxisCurrency(999_999)).toBe("$1M");
  });

  it("formats smaller values without cents", () => {
    expect(formatCompactAxisCurrency(0)).toBe("$0");
    expect(formatCompactAxisCurrency(999)).toBe("$999");
  });

  it("preserves negative values", () => {
    expect(formatCompactAxisCurrency(-1_500_000)).toBe("-$1.5M");
    expect(formatCompactAxisCurrency(-1_500_000_000)).toBe("-$1.5B");
  });
});
