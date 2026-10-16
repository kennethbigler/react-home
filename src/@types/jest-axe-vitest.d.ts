/* eslint-disable import/no-extraneous-dependencies -- Vitest module augmentation */
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import "vitest";

declare module "vitest" {
  // Vitest 5 only picks up custom matchers declared on Matchers<R, T>.
  interface Matchers<
    R extends void | Promise<void> = void | Promise<void>,
    // Matches Vitest's Matchers<R, T>. The received type is not used here.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required for declaration merging
    T = unknown,
  > extends TestingLibraryMatchers<
    ReturnType<typeof expect.stringContaining>,
    R
  > {
    toHaveNoViolations(): R;
  }
}
