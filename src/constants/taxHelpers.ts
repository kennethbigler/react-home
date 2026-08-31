export interface TaxBracket {
  upTo: number;
  rate: number;
}

export interface TaxSurcharge {
  threshold: number;
  rate: number;
}

/** Walk marginal brackets on income after standard deduction. */
export const computeProgressiveTax = (
  grossIncome: number,
  standardDeduction: number,
  brackets: TaxBracket[],
  surcharge?: TaxSurcharge,
): number => {
  const taxable = Math.max(0, grossIncome - standardDeduction);
  let tax = 0;
  let prev = 0;

  for (const { upTo, rate } of brackets) {
    if (taxable <= prev) {
      break;
    }

    const inBracket = Math.min(taxable, upTo) - prev;
    if (inBracket > 0) {
      tax += inBracket * rate;
    }

    prev = upTo;
  }

  if (surcharge && taxable > surcharge.threshold) {
    tax += (taxable - surcharge.threshold) * surcharge.rate;
  }

  return tax;
};
