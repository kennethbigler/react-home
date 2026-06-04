import { createElement, Fragment, ReactElement, ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

type HydrateAtomsProps = {
  children?: ReactNode;
  initialValues: Iterable<readonly [unknown, unknown]>;
};

const HydrateAtoms = ({ children, initialValues }: HydrateAtomsProps) => {
  useHydrateAtoms(initialValues as Parameters<typeof useHydrateAtoms>[0]);
  return createElement(Fragment, null, children);
};

export const renderWithHydratedAtoms = (
  ui: ReactElement,
  initialValues: Iterable<readonly [unknown, unknown]>,
  options?: RenderOptions,
) =>
  render(
    createElement(
      Provider,
      null,
      createElement(HydrateAtoms, { initialValues }, ui),
    ),
    options,
  );
