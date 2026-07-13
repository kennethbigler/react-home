import {
  CA_MENTAL_HEALTH_SURCHARGE,
  CA_STANDARD_DEDUCTION,
  caStateTaxBrackets,
} from "../../constants/caStateTaxBrackets";
import {
  FEDERAL_STANDARD_DEDUCTION,
  federalTaxBrackets,
} from "../../constants/federalTaxBrackets";
import { computeProgressiveTax } from "../../constants/taxHelpers";

/** Federal and CA taxes are computed independently (visualization approximation). */
export const computeFederalTax = (grossIncome: number): number =>
  computeProgressiveTax(
    grossIncome,
    FEDERAL_STANDARD_DEDUCTION,
    federalTaxBrackets,
  );

export const computeCaliforniaTax = (grossIncome: number): number =>
  computeProgressiveTax(
    grossIncome,
    CA_STANDARD_DEDUCTION,
    caStateTaxBrackets,
    CA_MENTAL_HEALTH_SURCHARGE,
  );

export const computeTotalTax = (grossIncome: number) => {
  const federal = computeFederalTax(grossIncome);
  const state = computeCaliforniaTax(grossIncome);

  return { federal, state, total: federal + state };
};
