import {
  createElement,
  Fragment,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  render,
  renderHook,
  type RenderHookOptions,
  type RenderOptions,
} from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

export type AtomInitialValues = Iterable<readonly [unknown, unknown]>;

type HydrateAtomsProps = {
  children?: ReactNode;
  initialValues: AtomInitialValues;
};

const HydrateAtoms = ({ children, initialValues }: HydrateAtomsProps) => {
  useHydrateAtoms(initialValues as Parameters<typeof useHydrateAtoms>[0]);
  return createElement(Fragment, null, children);
};

/**
 * Wrapper component factory for render/renderHook: a Jotai Provider around
 * `store` with `initialValues` hydrated before children mount. Hydration
 * (unlike `store.set`) does not write through to localStorage.
 */
export const createAtomWrapper = (
  initialValues: AtomInitialValues = [],
  store = createStore(),
) => {
  const wrapper = ({ children }: { children?: ReactNode }) =>
    createElement(
      Provider,
      { store },
      createElement(HydrateAtoms, { initialValues }, children),
    );
  return { wrapper, store };
};

/** Render `ui` inside a hydrated Jotai Provider; returns the store for
 *  asserting on atom state after interactions. */
export const renderWithHydratedAtoms = (
  ui: ReactElement,
  initialValues: AtomInitialValues = [],
  options?: RenderOptions,
) => {
  const { wrapper, store } = createAtomWrapper(initialValues);
  return { store, ...render(ui, { wrapper, ...options }) };
};

/** renderHook inside a hydrated Jotai Provider; returns the store for
 *  asserting on atom state after `act` calls. */
export const renderHookWithHydratedAtoms = <Result, Props>(
  callback: (props: Props) => Result,
  initialValues: AtomInitialValues = [],
  options?: RenderHookOptions<Props>,
) => {
  const { wrapper, store } = createAtomWrapper(initialValues);
  return { store, ...renderHook(callback, { wrapper, ...options }) };
};
