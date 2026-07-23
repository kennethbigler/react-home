/** Coerce non-finite form values (NaN / ±Infinity) to a finite fallback. */
export const finiteOr = (value: number, fallback = 0): number =>
  Number.isFinite(value) ? value : fallback;
