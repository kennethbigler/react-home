import Grid from "@mui/material/Grid2";
import { useRecoilValue } from "recoil";
import { CarEntry } from "../../../../constants/cars";
import CarChart from "./CarChart";
import CarSankeyGraph from "./CarSankeyGraph";
import ExpandableCard from "../../../common/expandable-card";
import themeAtom from "../../../../recoil/theme-atom";
import CurrentCarStats from "./CurrentCarStats";

interface CarGraphsProps {
  data: CarEntry[];
  hideFamily: boolean;
  hideKen: boolean;
}

const CarGraphs = ({ data, hideFamily, hideKen }: CarGraphsProps) => {
  const theme = useRecoilValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  return (
    <ExpandableCard title="Car Graphs">
      <Grid container spacing={2}>
        {data.length > 0 && (
          <>
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
          </>
        )}
        <CurrentCarStats data={data} color={color} />
        <CurrentCarStats data={data} color={color} isBike />
      </Grid>
    </ExpandableCard>
  );
};

export default CarGraphs;