import React from "react";
import { RecoilRoot } from "recoil";
import WithTheme from "./WithTheme";
// stores

/** App class that wraps higher level components of the application */
const WithStore = () => (
  <RecoilRoot>
    <WithTheme />
  </RecoilRoot>
);

export default WithStore;
