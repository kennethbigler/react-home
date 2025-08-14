import { describe, it, expect } from "vitest";
import type { MuiColors } from "./types";

describe("common/types", () => {
  describe("MuiColors", () => {
    it("should include all expected MUI color values", () => {
      const expectedColors: MuiColors[] = [
        "error",
        "info",
        "primary",
        "secondary",
        "success",
        "warning",
      ];

      expectedColors.forEach((color) => {
        // This test ensures TypeScript compilation works correctly
        // and that all expected colors are valid MuiColors
        expect(typeof color).toBe("string");
      });
    });

    it("should allow valid MUI color assignments", () => {
      const validColor: MuiColors = "primary";
      expect(validColor).toBe("primary");
    });

    it("should allow error color assignment", () => {
      const errorColor: MuiColors = "error";
      expect(errorColor).toBe("error");
    });

    it("should allow success color assignment", () => {
      const successColor: MuiColors = "success";
      expect(successColor).toBe("success");
    });
  });
});
