/** Annual US inflation multipliers by calendar year. */
const inflationRateByYear: Record<number, number> = {
  2000: 1.034,
  2001: 1.028,
  2002: 1.016,
  2003: 1.023,
  2004: 1.027,
  2005: 1.034,
  2006: 1.032,
  2007: 1.028,
  2008: 1.038,
  2009: 0.996,
  2010: 1.016,
  2011: 1.032,
  2012: 1.021,
  2013: 1.015,
  2014: 1.016,
  2015: 1.001,
  2016: 1.013,
  2017: 1.021,
  2018: 1.024,
  2019: 1.018,
  2020: 1.012,
  2021: 1.047,
  2022: 1.08,
  2023: 1.041,
  2024: 1.027,
  2025: 1.027,
  2026: 1.021,
};

/**
 * Multiplier applied to carry a value from `year` into `year + 1`.
 * Years outside the table return 1 so charts degrade gracefully
 * instead of producing NaN when the table lags the calendar.
 */
export const getInflationRate = (year: number): number =>
  inflationRateByYear[year] ?? 1;
