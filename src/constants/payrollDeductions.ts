/** 2026 US payroll withholdings — employee (visualization approximation). */

export const PAYROLL_NODE_LABEL = "Payroll";

/** Distinct pie-slice label for statutory withholdings (vs user Payroll category). */
export const PAYROLL_WITHHOLDINGS_LABEL = "Payroll Withholdings";

export const SOCIAL_SECURITY_LABEL = "Social Security";
export const MEDICARE_LABEL = "Medicare";
export const CA_DISABILITY_LABEL = "CA Disability";

/** OASDI employee rate on wages up to the annual wage base. */
const SOCIAL_SECURITY_RATE = 0.062;
export const SOCIAL_SECURITY_WAGE_BASE = 176_100;

/** Medicare employee rate on all wages. */
const MEDICARE_RATE = 0.0145;

/** Additional Medicare tax on wages above the threshold (single filer). */
const ADDITIONAL_MEDICARE_RATE = 0.009;
const ADDITIONAL_MEDICARE_THRESHOLD = 200_000;

/** CA SDI/PFL employee withholding — no wage cap since 2024. */
const CA_SDI_RATE = 0.013;

export const computeSocialSecurity = (wages: number): number =>
  Math.min(Math.max(0, wages), SOCIAL_SECURITY_WAGE_BASE) *
  SOCIAL_SECURITY_RATE;

export const computeMedicare = (wages: number): number => {
  const taxableWages = Math.max(0, wages);
  const base = taxableWages * MEDICARE_RATE;
  const additional =
    taxableWages > ADDITIONAL_MEDICARE_THRESHOLD
      ? (taxableWages - ADDITIONAL_MEDICARE_THRESHOLD) *
        ADDITIONAL_MEDICARE_RATE
      : 0;

  return base + additional;
};

export const computeCaDisability = (wages: number): number =>
  Math.max(0, wages) * CA_SDI_RATE;

export const computeTotalPayrollDeductions = (wages: number) => {
  const socialSecurity = computeSocialSecurity(wages);
  const medicare = computeMedicare(wages);
  const caDisability = computeCaDisability(wages);

  return {
    socialSecurity,
    medicare,
    caDisability,
    total: socialSecurity + medicare + caDisability,
  };
};
