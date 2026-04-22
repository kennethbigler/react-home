import { describe, it, expect } from "vitest";
import { getScoreText } from "./getScoreText";

describe("helpers | getScoreText", () => {
  it("returns empty string when score is undefined", () => {
    expect(getScoreText(undefined, 5)).toBe("");
  });

  it("returns empty string when comp is undefined", () => {
    expect(getScoreText(5, undefined)).toBe("");
  });

  it("returns empty string when score is 0", () => {
    expect(getScoreText(0, 5)).toBe("");
  });

  it("returns score string for positive score below 100", () => {
    expect(getScoreText(6, 4)).toBe("6");
  });

  it("returns score string without celebration for score >= 100 but less than comp", () => {
    expect(getScoreText(100, 110)).toBe("100");
  });

  it("returns celebration emoji when score >= 100 and score >= comp", () => {
    expect(getScoreText(100, 90)).toBe("🎉 100");
    expect(getScoreText(100, 100)).toBe("🎉 100");
  });

  it("returns formatted negative score with trailing zero and plus sign", () => {
    expect(getScoreText(-2, 5)).toBe("-20 + ");
    expect(getScoreText(-4, 0)).toBe("-40 + ");
  });
});
