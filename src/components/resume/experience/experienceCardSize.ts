import type { GridProps } from "@mui/material";

/** Shared 2–4 column card sizing used by Job and degree grids (12 / 6 / 4). */
export const experienceCardSize = (
  count: number,
  fullWidth = false,
): GridProps["size"] => ({
  xs: 12,
  lg: fullWidth || count < 2 ? 12 : 6,
  xxl: !fullWidth && count >= 3 ? 4 : undefined,
});
