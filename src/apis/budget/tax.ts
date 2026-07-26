import {
  CA_MENTAL_HEALTH_SURCHARGE,
  CA_STANDARD_DEDUCTION,
  CA_STANDARD_DEDUCTION_MFJ,
  caStateTaxBrackets,
  caStateTaxBracketsMfj,
} from "../../constants/caStateTaxBrackets";
import {
  FEDERAL_STANDARD_DEDUCTION,
  FEDERAL_STANDARD_DEDUCTION_MFJ,
  federalTaxBrackets,
  federalTaxBracketsMfj,
} from "../../constants/federalTaxBrackets";
import { computeProgressiveTax } from "../../constants/taxHelpers";
import type { TaxFilingStatus } from "./types";

const resolveFederalDeduction = (
  filingStatus: TaxFilingStatus,
  itemizedDeduction?: number,
): number => {
  if (itemizedDeduction !== undefined) {
    return itemizedDeduction;
  }
  return filingStatus === "mfj"
    ? FEDERAL_STANDARD_DEDUCTION_MFJ
    : FEDERAL_STANDARD_DEDUCTION;
};

const resolveCaDeduction = (
  filingStatus: TaxFilingStatus,
  itemizedDeduction?: number,
): number => {
  if (itemizedDeduction !== undefined) {
    return itemizedDeduction;
  }
  return filingStatus === "mfj"
    ? CA_STANDARD_DEDUCTION_MFJ
    : CA_STANDARD_DEDUCTION;
};

/** Federal and CA taxes are computed independently (visualization approximation). */
export const computeFederalTax = (
  grossIncome: number,
  filingStatus: TaxFilingStatus = "single",
  itemizedDeduction?: number,
): number =>
  computeProgressiveTax(
    grossIncome,
    resolveFederalDeduction(filingStatus, itemizedDeduction),
    filingStatus === "mfj" ? federalTaxBracketsMfj : federalTaxBrackets,
  );

export const computeCaliforniaTax = (
  grossIncome: number,
  filingStatus: TaxFilingStatus = "single",
  itemizedDeduction?: number,
): number =>
  computeProgressiveTax(
    grossIncome,
    resolveCaDeduction(filingStatus, itemizedDeduction),
    filingStatus === "mfj" ? caStateTaxBracketsMfj : caStateTaxBrackets,
    CA_MENTAL_HEALTH_SURCHARGE,
  );

export const computeTotalTax = (
  grossIncome: number,
  filingStatus: TaxFilingStatus = "single",
  itemizedDeduction?: number,
) => {
  const federal = computeFederalTax(
    grossIncome,
    filingStatus,
    itemizedDeduction,
  );
  const state = computeCaliforniaTax(
    grossIncome,
    filingStatus,
    itemizedDeduction,
  );

  return { federal, state, total: federal + state };
};
