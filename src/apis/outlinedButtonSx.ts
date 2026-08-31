import { deepOrange } from "@mui/material/colors";
import type { SxProps, Theme } from "@mui/material/styles";
import type { MuiColors } from "../@types/mui";

export const outlinedContrastSx = (
  paletteColor: MuiColors = "primary",
): SxProps<Theme> => [
  {
    "&.MuiButton-outlined": {
      borderColor: `${paletteColor}.dark`,
      color: `${paletteColor}.dark`,
    },
  },
  (theme) =>
    theme.applyStyles("dark", {
      "&.MuiButton-outlined": {
        borderColor: `${paletteColor}.light`,
        color: `${paletteColor}.light`,
      },
    }),
];

/** Warning outlined buttons need deepOrange[900] in light mode for WCAG contrast. */
export const warningOutlinedContrastSx: SxProps<Theme> = [
  {
    "&.MuiButton-outlined": {
      borderColor: deepOrange[900],
      color: deepOrange[900],
    },
  },
  (theme) =>
    theme.applyStyles("dark", {
      "&.MuiButton-outlined": {
        borderColor: theme.palette.warning.light,
        color: theme.palette.warning.light,
      },
    }),
];
