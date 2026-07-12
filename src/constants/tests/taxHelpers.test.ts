import { describe, expect, it } from "vitest";
import { computeProgressiveTax } from "../taxHelpers";

const sampleBrackets = [
  { upTo: 10_000, rate: 0.1 },
  { upTo: 50_000, rate: 0.2 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.3 },
];

describe("constants | taxHelpers", () => {
  it("returns zero when gross income is below the standard deduction", () => {
    expect(computeProgressiveTax(5_000, 10_000, sampleBrackets)).toBe(0);
  });

  it("walks marginal brackets on taxable income", () => {
    const tax = computeProgressiveTax(40_000, 0, sampleBrackets);

    expect(tax).toBeCloseTo(10_000 * 0.1 + 30_000 * 0.2, 5);
  });

  it("stops accumulating tax once taxable income is exhausted", () => {
    const tax = computeProgressiveTax(15_000, 0, sampleBrackets);

    expect(tax).toBeCloseTo(10_000 * 0.1 + 5_000 * 0.2, 5);
  });

  it("applies an optional surcharge above the threshold", () => {
    const tax = computeProgressiveTax(120_000, 0, sampleBrackets, {
      threshold: 100_000,
      rate: 0.01,
    });

    expect(tax).toBeCloseTo(
      10_000 * 0.1 + 40_000 * 0.2 + 70_000 * 0.3 + 20_000 * 0.01,
      5,
    );
  });
});
