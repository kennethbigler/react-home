import { useAtomValue } from "jotai";
import type { CarEntry } from "@/constants/cars";
import { groupedChart } from "@/components/common/highcharts/guardChart";
import { ChartSection } from "@/components/common/highcharts/ChartSection";
import ExpandableCard from "@/components/common/expandable-card";
import themeAtom from "@/jotai/theme-atom";
import CurrentCarStats from "./CurrentCarStats";
import { red } from "@mui/material/colors";
import { Grid } from "@mui/material";

const CarChart = groupedChart(() => import("./CarChart"));
const CarSankeyGraph = groupedChart(() => import("./CarSankeyGraph"));

interface CarGraphsProps {
  active: CarEntry;
  data: CarEntry[];
}

const CarGraphs = ({ data, active }: CarGraphsProps) => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  return (
    <ExpandableCard title="Car Graphs" backgroundColor={red.A700}>
      <ChartSection>
        <Grid container spacing={2} size={{ xs: 12 }} sx={{ minWidth: 0 }}>
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
            <CarSankeyGraph color={color} data={data} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CarChart data={data} color={color} />
          </Grid>
        </Grid>
      </ChartSection>
    </ExpandableCard>
  );
};

export default CarGraphs;
