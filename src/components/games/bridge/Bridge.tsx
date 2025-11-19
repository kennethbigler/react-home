import { memo } from "react";
import Header from "./header/Header";
import ScoreDisplay from "./ScoreDisplay";

const Bridge = memo(() => (
  <>
    <Header />
    <ScoreDisplay />
  </>
));

Bridge.displayName = "Bridge";

export default Bridge;
