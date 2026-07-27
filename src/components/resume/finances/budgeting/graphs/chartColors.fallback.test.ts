import { createTheme } from "@mui/material/styles";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../comp-calc/graphs/colors", () => ({
  default: [],
}));

import { getBudgetSankeyNodeColors } from "./chartColors";

const theme = createTheme();

describe("budgeting | chartColors fallbacks", () => {
  it("uses theme palette colors when comp colors are unavailable", () => {
    const colors = getBudgetSankeyNodeColors(theme);

    expect(colors.salary).toBe(theme.palette.success.main);
    expect(colors.bonus).toBe(theme.palette.warning.main);
    expect(colors.stockAdj).toBe(theme.palette.info.main);
    expect(colors.partnerSalary).toBeTruthy();
    expect(colors.partnerBonus).toBeTruthy();
    expect(colors.partnerStockAdj).toBeTruthy();
  });
});
