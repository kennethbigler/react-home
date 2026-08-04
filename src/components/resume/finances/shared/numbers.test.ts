import { describe, expect, it } from "vitest";
import { finiteOr } from "./numbers";

describe("resume | finances | shared | numbers", () => {
  it("returns finite numbers unchanged", () => {
    expect(finiteOr(0)).toBe(0);
    expect(finiteOr(12.5)).toBe(12.5);
    expect(finiteOr(-3)).toBe(-3);
  });

  it("coerces non-finite values to the fallback", () => {
    expect(finiteOr(Number.NaN)).toBe(0);
    expect(finiteOr(Number.POSITIVE_INFINITY)).toBe(0);
    expect(finiteOr(Number.NEGATIVE_INFINITY, 4)).toBe(4);
  });
});
