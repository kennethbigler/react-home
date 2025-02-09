import { useAtomValue } from "jotai";
import Grid from "@mui/material/Grid2";
import { CarEntry } from "../../../../constants/cars";
import CarChart from "./CarChart";
import CarSankeyGraph from "./CarSankeyGraph";
import ExpandableCard from "../../../common/expandable-card";
import themeAtom from "../../../../jotai/theme-atom";
import CurrentCarStats from "./CurrentCarStats";

interface CarGraphsProps {
  data: CarEntry[];
  hideFamily: boolean;
  hideKen: boolean;
}

const CarGraphs = ({ data, hideFamily, hideKen }: CarGraphsProps) => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  return (
    <ExpandableCard title="Car Graphs">
      <Grid container spacing={2}>
        <CurrentCarStats color={color} />
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
