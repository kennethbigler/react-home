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
        startYellowVal={2}
        startRedVal={Math.min(5, displacement.maxVal)}
        maxVal={displacement.maxVal}
        label="L"
        title="Displacement"
        name="Cayenne"
        color={color}
      />
      <CurrentCarStatsGraph
        val={horsepower.val}
        startYellowVal={250}
        startRedVal={Math.min(500, horsepower.maxVal)}
        maxVal={horsepower.maxVal}
        label="HP"
        title="Horsepower"
        name="Cayenne"
        color={color}
      />
      <CurrentCarStatsGraph
        val={mpg.val}
        startYellowVal={30}
        startRedVal={Math.min(100, mpg.maxVal)}
        maxVal={mpg.maxVal}
        label="MPG"
        title="MPG"
        name="Cayenne"
        color={color}
      />
      <CurrentCarStatsGraph
        val={torque.val}
        startYellowVal={250}
        startRedVal={Math.min(500, torque.maxVal)}
        maxVal={torque.maxVal}
        label="lb-ft"
        title="Torque"
        name="Cayenne"
        color={color}
      />
      <CurrentCarStatsGraph
        val={weight.val}
        startYellowVal={3500}
        startRedVal={Math.min(4600, weight.maxVal)}
        maxVal={weight.maxVal}
        label="lbs"
        title="Weight"
        name="Cayenne"
        color={color}
      />
      <CurrentCarStatsGraph
        val={powerToWeight.val}
        startYellowVal={0.05}
        startRedVal={Math.min(0.15, powerToWeight.maxVal)}
        maxVal={powerToWeight.maxVal}
        label="Ratio"
        title="Power to Weight"
        name="Cayenne"
        color={color}
      />
    </Grid>
  );
});

CurrentCarStats.displayName = "CurrentCarStats";

export default CurrentCarStats;
