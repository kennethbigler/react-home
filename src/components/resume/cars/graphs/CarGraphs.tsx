import { useAtomValue } from "jotai";
import { CarEntry } from "../../../../constants/cars";
import CarChart from "./CarChart";
import CarSankeyGraph from "./CarSankeyGraph";
import ExpandableCard from "../../../common/expandable-card";
import themeAtom from "../../../../jotai/theme-atom";
import CurrentCarStats from "./CurrentCarStats";
import { red } from "@mui/material/colors";
import { Grid } from "@mui/material";

interface CarGraphsProps {
  active: CarEntry;
  data: CarEntry[];
  hideFamily: boolean;
  hideKen: boolean;
}

const CarGraphs = ({ data, active, hideFamily, hideKen }: CarGraphsProps) => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  return (
    <ExpandableCard title="Car Graphs" backgroundColor={red.A700}>
      <Grid container spacing={2}>
        <CurrentCarStats
          color={color}
          name={active.car}
          zTo60={active.zTo60}
          horsepower={active.horsepower}
          mpg={active.MPG}
          torque={active.torque}
          weight={active.weight}
          powerToWeight={active.horsepower / active.weight}
        />
        <Grid size={{ xs: 12, md: 6 }}>
          <CarSankeyGraph
            hideKen={hideKen}
            hideFamily={hideFamily}
            color={color}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CarChart data={data} color={color} />
        </Grid>
      </Grid>
    </ExpandableCard>
  );
};

export default CarGraphs;
