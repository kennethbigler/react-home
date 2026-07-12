import { describe, expect, it } from "vitest";
import {
  computeCaDisability,
  computeMedicare,
  computeSocialSecurity,
  computeTotalPayrollDeductions,
  SOCIAL_SECURITY_WAGE_BASE,
} from "../payrollDeductions";

describe("constants | payrollDeductions", () => {
  it("caps social security at the wage base", () => {
    expect(computeSocialSecurity(100_000)).toBeCloseTo(100_000 * 0.062, 2);
    expect(
      computeSocialSecurity(SOCIAL_SECURITY_WAGE_BASE + 50_000),
    ).toBeCloseTo(SOCIAL_SECURITY_WAGE_BASE * 0.062, 2);
  });

  it("computes medicare with additional tax above the threshold", () => {
    expect(computeMedicare(100_000)).toBeCloseTo(100_000 * 0.0145, 2);
    expect(computeMedicare(250_000)).toBeCloseTo(
      250_000 * 0.0145 + 50_000 * 0.009,
      2,
    );
  });

  it("withholds CA disability on all wages", () => {
    expect(computeCaDisability(300_000)).toBeCloseTo(300_000 * 0.012, 2);
  });

  it("sums payroll deductions", () => {
    const deductions = computeTotalPayrollDeductions(150_000);

    expect(deductions.total).toBeCloseTo(
      deductions.socialSecurity + deductions.medicare + deductions.caDisability,
      2,
    );
  });
});
