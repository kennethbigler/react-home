import { describe, it, expect } from "vitest";
import { cssEscape } from "../cssEscape";

describe("apis | cssEscape", () => {
  it("escapes leading digits with hexadecimal form", () => {
    expect(cssEscape("1foo")).toBe("\\31 foo");
    expect(cssEscape("-1foo")).toBe("\\2d \\31 foo");
  });

  it("replaces NUL characters with U+FFFD", () => {
    expect(cssEscape("a\u0000b")).toBe("a\uFFFDb");
    expect(cssEscape("\u0000")).toBe("\uFFFD");
  });
});
