import * as React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { render as rtlRender, RenderResult } from "@testing-library/react";
import { RecoilRoot } from "recoil";

const render = (
  ui: React.ReactElement,
  { ...renderOptions } = {},
): RenderResult => {
  const Wrapper: React.ComponentType = ({
    children,
  }: {
    children?: React.ReactNode;
  }) => <RecoilRoot>{children}</RecoilRoot>;
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

// override render method
export default render;
