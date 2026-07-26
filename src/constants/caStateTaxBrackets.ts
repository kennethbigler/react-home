/** 2025 California state income tax — single filer (FTB schedule; visualization approximation). */

export const CA_STANDARD_DEDUCTION = 5_706;

/** 2025 California state income tax — married filing jointly. */
export const CA_STANDARD_DEDUCTION_MFJ = 11_412;

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

/** Marginal rates on taxable income after CA standard deduction (single). */
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

/** Marginal rates on taxable income after CA standard deduction (MFJ / Schedule Y). */
export const CA_STATE_TAX_BRACKETS_MFJ: TaxBracket[] = [
  { upTo: 22_158, rate: 0.01 },
  { upTo: 52_528, rate: 0.02 },
  { upTo: 82_904, rate: 0.04 },
  { upTo: 115_084, rate: 0.06 },
  { upTo: 145_448, rate: 0.08 },
  { upTo: 742_958, rate: 0.093 },
  { upTo: 891_542, rate: 0.103 },
  { upTo: 1_485_906, rate: 0.113 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.123 },
];
