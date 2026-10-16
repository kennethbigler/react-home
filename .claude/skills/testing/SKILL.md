---
name: testing
description: >-
  Test generation standards and verification requirements for this repo. Use
  whenever writing, generating, or reviewing tests, or before declaring code
  complete to confirm tests and verification pass.
---

# Testing

Stack: Vitest (globals, jsdom), `@testing-library/react`, `vi` for mocks. Versions: `package.json`.

## Gate

`npm run verify` = `tsc` → `knip` → `lint` → `test:coverage`. Add `npm run build` if build/config changed.

## Coverage (enforced in `vite.config.ts`)

| Scope | Statements | Branches | Functions | Lines |
| --- | --- | --- | --- | --- |
| Project | 85% | 80% | 85% | 85% |
| Each covered file | 50% | 50% | 50% | 50% |

Per-file floor: `scripts/check-per-file-coverage.mjs`.
Excluded: `src/images/**`, `src/index.css`, `src/vite-env.d.ts`, `src/@types/**`, `**/types.ts`, `**/index.ts`.

## Conventions

- Co-locate: `Name.test.tsx`, `helper.test.ts`; group in `tests/` when needed
- `describe("category | Name", …)`
- Test user-visible behavior, not state variable names or internals
- Don't test third-party libs (React, MUI) or static content
- Await async UI (`findBy*`, `waitFor`); restore spies/mocks after use

## Query priority

`getByRole` → `getByLabelText` → `getByPlaceholderText` → `getByText` → `getByTestId` (last resort)

## Jotai

Use `src/test-utils/` — don't hand-roll `createStore()` + `<Provider>`:

- `renderWithHydratedAtoms`, `renderHookWithHydratedAtoms`, `createAtomWrapper` (all return the store)
- `getHydratedAtomValue` — read an `atomWithStorage` atom like a fresh page load

## Always cover

- Clicks, form submits, keyboard events
- Each conditional render state (loading / data / error)
- Validation and error handling
- Props → output
- Accessible behavior (keyboard nav, ARIA)

## Error boundary pattern

```tsx
const spy = vi.spyOn(console, "error").mockImplementation(() => {});
render(<ErrorBoundary><Thrower /></ErrorBoundary>);
expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
spy.mockRestore();
```
