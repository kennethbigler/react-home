/* eslint-disable import/no-extraneous-dependencies -- Vitest module augmentation */
import "vitest";

declare module "vitest" {
  interface Assertion<_T = unknown> {
    toHaveNoViolations(): void;
  }

  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}
