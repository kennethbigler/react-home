import * as React from "react";
import { processCurrentCarStats } from "../../../../constants/cars";
import CurrentCarStatsGraph from "./CurrentCarStatsGraph";

export interface CurrentCarStatsProps {
  color: "black" | "white";
  isBike?: boolean;
}

const CurrentCarStats = React.memo(
  ({ color, isBike }: CurrentCarStatsProps) => {
    const zTo60 = processCurrentCarStats("zTo60", isBike);
    const horsepower = processCurrentCarStats("horsepower", isBike);
    const mpg = processCurrentCarStats("MPG", isBike);
    const torque = processCurrentCarStats("torque", isBike);
    const weight = processCurrentCarStats("weight", isBike);
    const powerToWeight = processCurrentCarStats("powerToWeight", isBike);

    return (
      <>
        <CurrentCarStatsGraph
          val={zTo60.val}
          endGreenVal={4}
          startRedVal={Math.min(10, zTo60.maxVal)}
          maxVal={zTo60.maxVal}
          label="sec"
          title="0-60"
          name={zTo60.name}
          color={color}
        />
        <CurrentCarStatsGraph
          val={horsepower.val}
          endGreenVal={200}
          startRedVal={Math.min(500, horsepower.maxVal)}
          maxVal={horsepower.maxVal}
          label="HP"
          title="Horsepower"
          name={horsepower.name}
          color={color}
        />
        <CurrentCarStatsGraph
          isBike={isBike}
          val={weight.val}
          endGreenVal={3000}
          startRedVal={Math.min(4600, weight.maxVal)}
          maxVal={weight.maxVal}
          label="lbs"
          title="Weight"
          name={weight.name}
          color={color}
        />
        <CurrentCarStatsGraph
          val={powerToWeight.val}
          endGreenVal={0.05}
          startRedVal={Math.min(0.15, powerToWeight.maxVal)}
          maxVal={powerToWeight.maxVal}
          label="Ratio"
          title="Power to Weight"
          name={powerToWeight.name}
          color={color}
        />
        <CurrentCarStatsGraph
          val={torque.val}
          endGreenVal={200}
          startRedVal={Math.min(500, torque.maxVal)}
          maxVal={torque.maxVal}
          label="lb-ft"
          title="Torque"
          name={torque.name}
          color={color}
        />
        <CurrentCarStatsGraph
          val={mpg.val}
          endGreenVal={30}
          startRedVal={Math.min(100, mpg.maxVal)}
          maxVal={mpg.maxVal}
          label="MPG"
          title="MPG"
          name={mpg.name}
          color={color}
        />
      </>
    );
  },
);

CurrentCarStats.displayName = "CurrentCarStats";

export default CurrentCarStats;
