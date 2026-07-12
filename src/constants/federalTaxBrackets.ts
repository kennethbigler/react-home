/** 2025 US federal income tax — single filer (visualization approximation). */

export const FEDERAL_STANDARD_DEDUCTION = 15_750;

export const FEDERAL_TAX_LABEL = "Fed Tax";

export interface TaxBracket {
  upTo: number;
  rate: number;
}

/** Marginal rates on taxable income after standard deduction. */
export const federalTaxBrackets: TaxBracket[] = [
  { upTo: 11_925, rate: 0.1 },
  { upTo: 48_475, rate: 0.12 },
  { upTo: 103_350, rate: 0.22 },
  { upTo: 197_300, rate: 0.24 },
  { upTo: 250_525, rate: 0.32 },
  { upTo: 626_350, rate: 0.35 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.37 },
];
