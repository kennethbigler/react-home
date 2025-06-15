import * as React from "react";
import { processCurrentCarStats } from "../../../../constants/cars";
import CarSpeedoGraph from "./CarSpeedoGraph";

export interface CurrentCarStatsProps {
  color: "black" | "white";
}

const CurrentCarStats = React.memo(({ color }: CurrentCarStatsProps) => {
  const zTo60 = processCurrentCarStats("zTo60");
  const horsepower = processCurrentCarStats("horsepower");
  const mpg = processCurrentCarStats("MPG");
  const torque = processCurrentCarStats("torque");
  const weight = processCurrentCarStats("weight");
  const powerToWeight = processCurrentCarStats("powerToWeight");

  return (
    <>
      <CarSpeedoGraph
        val={zTo60.val}
        endGreenVal={4}
        startRedVal={Math.min(10, zTo60.maxVal)}
        maxVal={zTo60.maxVal}
        label="sec"
        title="0-60"
        name={zTo60.name}
        color={color}
      />
      <CarSpeedoGraph
        val={horsepower.val}
        endGreenVal={200}
        startRedVal={Math.min(650, horsepower.maxVal)}
        maxVal={horsepower.maxVal}
        label="HP"
        title="Horsepower"
        name={horsepower.name}
        color={color}
      />
      <CarSpeedoGraph
        val={weight.val}
        endGreenVal={3000}
        startRedVal={Math.min(5000, weight.maxVal)}
        maxVal={weight.maxVal}
        label="lbs"
        title="Weight"
        name={weight.name}
        color={color}
      />
      <CarSpeedoGraph
        val={powerToWeight.val}
        endGreenVal={0.05}
        startRedVal={Math.min(0.15, powerToWeight.maxVal)}
        maxVal={powerToWeight.maxVal}
        label="Ratio"
        title="Power to Weight"
        name={powerToWeight.name}
        color={color}
      />
      <CarSpeedoGraph
        val={torque.val}
        endGreenVal={200}
        startRedVal={Math.min(650, torque.maxVal)}
        maxVal={torque.maxVal}
        label="lb-ft"
        title="Torque"
        name={torque.name}
        color={color}
      />
      <CarSpeedoGraph
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
});

CurrentCarStats.displayName = "CurrentCarStats";

export default CurrentCarStats;
