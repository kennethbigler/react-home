import * as React from "react";
import Grid from "@mui/material/Grid2";
import { CarStats, processCurrentCarStats } from "../../../constants/cars";
import CurrentCarStatsGraph from "./CurrentCarStatsGraph";

export interface CurrentCarStatsProps {
  data: CarStats[];
  color: string;
}

const CurrentCarStats = React.memo(({ data, color }: CurrentCarStatsProps) => {
  const displacement = processCurrentCarStats(data, "displacement");
  const horsepower = processCurrentCarStats(data, "horsepower");
  const mpg = processCurrentCarStats(data, "MPG");
  const torque = processCurrentCarStats(data, "torque");
  const weight = processCurrentCarStats(data, "weight");
  const powerToWeight = processCurrentCarStats(data, "powerToWeight");

  return (
    <Grid container spacing={2}>
      <CurrentCarStatsGraph
        val={displacement.val}
        startYellowVal={displacement.startYellowVal}
        startRedVal={displacement.startRedVal}
        maxVal={displacement.maxVal}
        label="L"
        title="Displacement"
        name="Cayenne"
        color={color}
      />
      <CurrentCarStatsGraph
        val={horsepower.val}
        startYellowVal={horsepower.startYellowVal}
        startRedVal={horsepower.startRedVal}
        maxVal={horsepower.maxVal}
        label="HP"
        title="Horsepower"
        name="Cayenne"
        color={color}
      />
      <CurrentCarStatsGraph
        val={mpg.val}
        startYellowVal={mpg.startYellowVal}
        startRedVal={mpg.startRedVal}
        maxVal={mpg.maxVal}
        label="MPG"
        title="MPG"
        name="Cayenne"
        color={color}
      />
      <CurrentCarStatsGraph
        val={torque.val}
        startYellowVal={torque.startYellowVal}
        startRedVal={torque.startRedVal}
        maxVal={torque.maxVal}
        label="lb-ft"
        title="Torque"
        name="Cayenne"
        color={color}
      />
      <CurrentCarStatsGraph
        val={weight.val}
        startYellowVal={weight.startYellowVal}
        startRedVal={weight.startRedVal}
        maxVal={weight.maxVal}
        label="lbs"
        title="Weight"
        name="Cayenne"
        color={color}
      />
      <CurrentCarStatsGraph
        val={powerToWeight.val}
        startYellowVal={powerToWeight.startYellowVal}
        startRedVal={powerToWeight.startRedVal}
        maxVal={powerToWeight.maxVal}
        label="Ratio"
        title="Power to Weight"
        name="Cayenne"
        color={color}
      />
    </Grid>
  );
});

export default CurrentCarStats;
