import {
  CA_MENTAL_HEALTH_SURCHARGE,
  CA_STANDARD_DEDUCTION,
  CA_STANDARD_DEDUCTION_MFJ,
  CA_STATE_TAX_BRACKETS_MFJ,
  caStateTaxBrackets,
} from "../../constants/caStateTaxBrackets";
import {
  FEDERAL_STANDARD_DEDUCTION,
  FEDERAL_STANDARD_DEDUCTION_MFJ,
  FEDERAL_TAX_BRACKETS_MFJ,
  federalTaxBrackets,
} from "../../constants/federalTaxBrackets";
import { computeProgressiveTax } from "../../constants/taxHelpers";
import type { TaxFilingStatus } from "./types";

const resolveFederalDeduction = (
  filingStatus: TaxFilingStatus,
  itemizedDeduction?: number,
): number => {
  const standard =
    filingStatus === "mfj"
      ? FEDERAL_STANDARD_DEDUCTION_MFJ
      : FEDERAL_STANDARD_DEDUCTION;
  return itemizedDeduction === undefined
    ? standard
    : Math.max(standard, itemizedDeduction);
};

const resolveCaDeduction = (
  filingStatus: TaxFilingStatus,
  itemizedDeduction?: number,
): number => {
  const standard =
    filingStatus === "mfj" ? CA_STANDARD_DEDUCTION_MFJ : CA_STANDARD_DEDUCTION;
  return itemizedDeduction === undefined
    ? standard
    : Math.max(standard, itemizedDeduction);
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
    filingStatus === "mfj" ? FEDERAL_TAX_BRACKETS_MFJ : federalTaxBrackets,
  );

export const computeCaliforniaTax = (
  grossIncome: number,
  filingStatus: TaxFilingStatus = "single",
  itemizedDeduction?: number,
): number =>
  computeProgressiveTax(
    grossIncome,
    resolveCaDeduction(filingStatus, itemizedDeduction),
    filingStatus === "mfj" ? CA_STATE_TAX_BRACKETS_MFJ : caStateTaxBrackets,
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
