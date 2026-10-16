import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "vitest" {
  // TODO: Drop the TestingLibraryMatchers extend once @testing-library/jest-dom
  // types target Vitest 5 (https://github.com/testing-library/jest-dom/pull/742).
  // Keep toHaveNoViolations; jest-axe still has no Vitest matcher types.
  interface Matchers<
    R extends void | Promise<void> = void | Promise<void>,
    T = unknown,
  > extends TestingLibraryMatchers<T, R> {
    toHaveNoViolations(): R;
  }
}
