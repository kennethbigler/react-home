import type { Theme } from "@mui/material/styles";
import compColors from "../comp-calc/graphs/colors";
import type { ExpenseEntryColor } from "../../../../jotai/finances-atom";
import type { CategoryTotal, PiePoint } from "./helpers";

const getCategoryPaletteColor = (
  theme: Theme,
  color?: ExpenseEntryColor,
): string => {
  if (!color) {
    return theme.palette.error.main;
  }

  return theme.palette[color].main;
};

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

  const paletteColor = color ?? "error";
  const { light, main, dark } = theme.palette[paletteColor];

  if (count === 1) {
    return [main];
  }

  return Array.from({ length: count }, (_, index) => {
    const ratio = index / (count - 1);

    return mixHexColors(light, dark, ratio);
  });
};

export const colorizeCategoryPieData = (
  theme: Theme,
  categories: CategoryTotal[],
  data: PiePoint[],
): PiePoint[] => {
  const colorByHeading = new Map(
    categories.map(({ heading, color }) => [
      heading,
      getCategoryPaletteColor(theme, color),
    ]),
  );

  return data.map((point) => ({
    ...point,
    color: colorByHeading.get(point.name) ?? theme.palette.error.main,
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
  salary: compColors[2] ?? theme.palette.success.main,
  bonus: compColors[1] ?? theme.palette.warning.main,
  stockAdj: compColors[0] ?? theme.palette.info.main,
  gross: theme.palette.primary.main,
  federalTax: theme.palette.error.main,
  stateTax: theme.palette.error.main,
  unallocated: theme.palette.grey[500],
  category: (_categoryKey: string, color?: ExpenseEntryColor) =>
    getCategoryPaletteColor(theme, color),
});
