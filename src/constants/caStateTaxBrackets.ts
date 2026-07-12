/** 2025 California state income tax — single filer (FTB schedule; visualization approximation). */

export const CA_STANDARD_DEDUCTION = 5_706;

export const STATE_TAX_LABEL = "CA Tax";

/** Mental health services surcharge on taxable income above $1M. */
export const CA_MENTAL_HEALTH_SURCHARGE = {
  threshold: 1_000_000,
  rate: 0.01,
};

export interface TaxBracket {
  upTo: number;
  rate: number;
}

/** Marginal rates on taxable income after CA standard deduction. */
export const caStateTaxBrackets: TaxBracket[] = [
  { upTo: 11_079, rate: 0.01 },
  { upTo: 26_264, rate: 0.02 },
  { upTo: 41_452, rate: 0.04 },
  { upTo: 57_542, rate: 0.06 },
  { upTo: 72_724, rate: 0.08 },
  { upTo: 371_479, rate: 0.093 },
  { upTo: 445_771, rate: 0.103 },
  { upTo: 742_953, rate: 0.113 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.123 },
];
