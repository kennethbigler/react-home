import { describe, expect, it } from "vitest";
import slugifyTabPrefix from "./slugify-tab-prefix";

describe("common | tab-group | slugifyTabPrefix", () => {
  it("lowercases and replaces non-alphanumerics with dashes", () => {
    expect(slugifyTabPrefix("Example Tabs")).toBe("example-tabs");
    expect(slugifyTabPrefix("a11y practice tab examples")).toBe(
      "a11y-practice-tab-examples",
    );
  });

  it("trims leading and trailing dashes", () => {
    expect(slugifyTabPrefix("  --Hello World--  ")).toBe("hello-world");
  });

  it("collapses consecutive separators", () => {
    expect(slugifyTabPrefix("Finances   sections!!!")).toBe(
      "finances-sections",
    );
  });
});
