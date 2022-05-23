import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from "@testing-library/react";
import { Store } from "redux";
import { Provider } from "react-redux";

import { store as renderStore, RootState } from "./store/store";

interface CustomRenderOptions extends Omit<RenderOptions, "queries"> {
  initialState?: RootState;
  store?: Store;
}

const render = (
  ui: React.ReactElement,
  {
    initialState,
    store = renderStore,
    ...renderOptions
  }: CustomRenderOptions = {}
): RenderResult => {
  const Wrapper: React.ComponentType = ({
    children,
  }: {
    children?: React.ReactNode;
  }) => <Provider store={store}>{children}</Provider>;
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

// override render method
export default render;
