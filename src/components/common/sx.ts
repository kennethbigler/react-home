import type { SxProps, Theme } from "@mui/material";

type SxArray = Extract<SxProps<Theme>, ReadonlyArray<unknown>>;

/** Normalize an `sx` prop to an array so it can be spread into another `sx` array. */
export const toSxArray = (sx: SxProps<Theme>): SxArray =>
  Array.isArray(sx) ? (sx as SxArray) : ([sx] as SxArray);
