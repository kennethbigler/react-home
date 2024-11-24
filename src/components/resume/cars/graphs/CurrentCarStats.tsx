import * as React from "react";
import { CarEntry, processCurrentCarStats } from "../../../../constants/cars";
import CurrentCarStatsGraph from "./CurrentCarStatsGraph";

export interface CurrentCarStatsProps {
  data: CarEntry[];
  color: string;
  isBike?: boolean;
}

const CurrentCarStats = React.memo(
  ({ data, color, isBike }: CurrentCarStatsProps) => {
    const displacement = processCurrentCarStats(data, "displacement", isBike);
    const horsepower = processCurrentCarStats(data, "horsepower", isBike);
    const mpg = processCurrentCarStats(data, "MPG", isBike);
    const torque = processCurrentCarStats(data, "torque", isBike);
    const weight = processCurrentCarStats(data, "weight", isBike);
    const powerToWeight = processCurrentCarStats(data, "powerToWeight", isBike);

    return (
      <>
        <CurrentCarStatsGraph
          val={displacement.val}
          startYellowVal={2}
          startRedVal={Math.min(5, displacement.maxVal)}
          maxVal={displacement.maxVal}
          label="L"
          title="Displacement"
          name={displacement.name}
          color={color}
        />
        <CurrentCarStatsGraph
          val={horsepower.val}
          startYellowVal={250}
          startRedVal={Math.min(500, horsepower.maxVal)}
          maxVal={horsepower.maxVal}
          label="HP"
          title="Horsepower"
          name={horsepower.name}
          color={color}
        />
        <CurrentCarStatsGraph
          val={mpg.val}
          startYellowVal={30}
          startRedVal={Math.min(100, mpg.maxVal)}
          maxVal={mpg.maxVal}
          label="MPG"
          title="MPG"
          name={mpg.name}
          color={color}
        />
        <CurrentCarStatsGraph
          val={torque.val}
          startYellowVal={250}
          startRedVal={Math.min(500, torque.maxVal)}
          maxVal={torque.maxVal}
          label="lb-ft"
          title="Torque"
          name={torque.name}
          color={color}
        />
        <CurrentCarStatsGraph
          isBike={isBike}
          val={weight.val}
          startYellowVal={3500}
          startRedVal={Math.min(4600, weight.maxVal)}
          maxVal={weight.maxVal}
          label="lbs"
          title="Weight"
          name={weight.name}
          color={color}
        />
        <CurrentCarStatsGraph
          val={powerToWeight.val}
          startYellowVal={0.05}
          startRedVal={Math.min(0.15, powerToWeight.maxVal)}
          maxVal={powerToWeight.maxVal}
          label="Ratio"
          title="Power to Weight"
          name={powerToWeight.name}
          color={color}
        />
      </>
    );
  },
);

CurrentCarStats.displayName = "CurrentCarStats";

export default CurrentCarStats;
