import { describe, it, expect } from "vitest";
import type { ChipColorOptions } from "./types";

describe("are-you-the-one/types", () => {
  describe("ChipColorOptions", () => {
    it("should include all MUI colors plus default", () => {
      const validColors: ChipColorOptions[] = [
        "error",
        "info",
        "primary",
        "secondary",
        "success",
        "warning",
        "default",
      ];

      validColors.forEach((color) => {
        expect(typeof color).toBe("string");
      });
    });

    it("should allow MUI color assignments", () => {
      const primaryColor: ChipColorOptions = "primary";
      expect(primaryColor).toBe("primary");
    });

    it("should allow default color assignment", () => {
      const defaultColor: ChipColorOptions = "default";
      expect(defaultColor).toBe("default");
    });

    it("should allow error color assignment", () => {
      const errorColor: ChipColorOptions = "error";
      expect(errorColor).toBe("error");
    });
  });
});
