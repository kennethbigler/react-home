import { memo } from "react";
import CarSpeedoGraph from "./CarSpeedoGraph";

export interface CurrentCarStatsProps {
  color: "black" | "white";
  name: string;
  zTo60: number;
  horsepower: number;
  mpg: number;
  torque: number;
  weight: number;
  powerToWeight: number;
}

const CurrentCarStats = memo(
  ({
    color,
    name,
    zTo60,
    horsepower,
    mpg,
    torque,
    weight,
    powerToWeight,
  }: CurrentCarStatsProps) => (
    <>
      <CarSpeedoGraph
        color={color}
        name={name}
        val={zTo60}
        endGreenVal={4}
        startRedVal={10}
        maxVal={13}
        label="sec"
        title="0-60"
      />
      <CarSpeedoGraph
        color={color}
        name={name}
        val={horsepower}
        endGreenVal={200}
        startRedVal={650}
        maxVal={900}
        label="HP"
        title="Horsepower"
      />
      <CarSpeedoGraph
        color={color}
        name={name}
        val={weight}
        endGreenVal={2000}
        startRedVal={5000}
        maxVal={7000}
        label="lbs"
        title="Weight"
      />
      <CarSpeedoGraph
        color={color}
        name={name}
        val={powerToWeight}
        endGreenVal={0.05}
        startRedVal={0.15}
        maxVal={0.2}
        label="Ratio"
        title="Power to Weight"
      />
      <CarSpeedoGraph
        color={color}
        name={name}
        val={torque}
        endGreenVal={200}
        startRedVal={650}
        maxVal={1103}
        label="lb-ft"
        title="Torque"
      />
      <CarSpeedoGraph
        color={color}
        name={name}
        val={mpg}
        endGreenVal={30}
        startRedVal={100}
        maxVal={130}
        label="MPG"
        title="MPG"
      />
    </>
  ),
);

CurrentCarStats.displayName = "CurrentCarStats";

export default CurrentCarStats;
