import type { Theme } from "@mui/material/styles";
import { STATE_TAX_LABEL } from "@/constants/caStateTaxBrackets";
import { FEDERAL_TAX_LABEL } from "@/constants/federalTaxBrackets";
import {
  PAYROLL_NODE_LABEL,
  PAYROLL_WITHHOLDINGS_LABEL,
} from "@/constants/payrollDeductions";
import type { CategoryTotal, ExpenseEntryColor } from "@/apis/budget";
import {
  bonusColor,
  salaryColor,
  stockColor,
} from "@/components/resume/finances/shared/chartPalette";
import type { PiePoint } from "./types";
import { UNALLOCATED_NODE } from "./types";

/** Category color from the palette, or the given fallback when unset. */
const resolveCategoryColor = (
  theme: Theme,
  color: ExpenseEntryColor | undefined,
  fallback: string,
): string => (color ? theme.palette[color].main : fallback);

const parseHexColor = (hex: string) => {
  const normalized = hex.replace("#", "");

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
};

const toHex = (value: number) => value.toString(16).padStart(2, "0");

export const mixHexColors = (
  from: string,
  to: string,
  ratio: number,
): string => {
  const start = parseHexColor(from);
  const end = parseHexColor(to);
  const weight = Math.min(1, Math.max(0, ratio));

  const r = Math.round(start.r + (end.r - start.r) * weight);
  const g = Math.round(start.g + (end.g - start.g) * weight);
  const b = Math.round(start.b + (end.b - start.b) * weight);

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const buildCategoryColorShades = (
  theme: Theme,
  color: ExpenseEntryColor | undefined,
  count: number,
): string[] => {
  if (count <= 0) {
    return [];
  }

  const { light, main, dark } = color
    ? theme.palette[color]
    : {
        light: theme.palette.grey[300],
        main: theme.palette.grey[500],
        dark: theme.palette.grey[700],
      };

  if (count === 1) {
    return [main];
  }

  return Array.from({ length: count }, (_, index) => {
    const ratio = index / (count - 1);

    return mixHexColors(light, dark, ratio);
  });
};

/** Pie color per category heading (grey when the category has no color). */
const buildColorByHeading = (theme: Theme, categories: CategoryTotal[]) =>
  new Map(
    categories.map(({ heading, color }) => [
      heading,
      resolveCategoryColor(theme, color, theme.palette.grey[500]),
    ]),
  );

export const colorizeCategoryPieData = (
  theme: Theme,
  categories: CategoryTotal[],
  data: PiePoint[],
): PiePoint[] => {
  const colorByHeading = buildColorByHeading(theme, categories);

  return data.map((point) => ({
    ...point,
    color: colorByHeading.get(point.name) ?? theme.palette.grey[500],
  }));
};

export const colorizeIncomeOverviewPieData = (
  theme: Theme,
  categories: CategoryTotal[],
  data: PiePoint[],
): PiePoint[] => {
  const colorByHeading = buildColorByHeading(theme, categories);

  const fixedColors: Record<string, string> = {
    [FEDERAL_TAX_LABEL]: theme.palette.error.main,
    [STATE_TAX_LABEL]: theme.palette.error.main,
    [PAYROLL_NODE_LABEL]: theme.palette.error.main,
    [PAYROLL_WITHHOLDINGS_LABEL]: theme.palette.error.main,
    [UNALLOCATED_NODE]: theme.palette.grey[500],
  };

  return data.map((point) => ({
    ...point,
    color:
      fixedColors[point.name] ??
      colorByHeading.get(point.name) ??
      theme.palette.grey[500],
  }));
};

export const colorizeBreakdownPieData = (
  theme: Theme,
  color: ExpenseEntryColor | undefined,
  data: PiePoint[],
): PiePoint[] => {
  const shades = buildCategoryColorShades(theme, color, data.length);

  return data.map((point, index) => ({
    ...point,
    color: shades[index],
  }));
};

export const getBudgetSankeyNodeColors = (theme: Theme) => ({
  salary: salaryColor,
  bonus: bonusColor,
  stockAdj: stockColor,
  partnerSalary: mixHexColors(salaryColor, theme.palette.grey[300], 0.35),
  partnerBonus: mixHexColors(bonusColor, theme.palette.grey[300], 0.35),
  partnerStockAdj: mixHexColors(stockColor, theme.palette.grey[300], 0.35),
  gross: theme.palette.primary.main,
  federalTax: theme.palette.error.main,
  stateTax: theme.palette.error.main,
  payroll: theme.palette.error.main,
  unallocated: theme.palette.grey[500],
  category: (_categoryKey: string, color?: ExpenseEntryColor) =>
    resolveCategoryColor(theme, color, theme.palette.error.main),
});
