import { memo } from "react";
import {
  pastKensCars,
  currentKensCars,
  pastFamilyCars,
  currentFamilyCars,
} from "../../../constants/cars";
import CarCard from "./CarCard";
import ExpandableCard from "../../common/expandable-card";
import { red } from "@mui/material/colors";
import { Grid } from "@mui/material";

const pastKensCarsReversed = pastKensCars.slice().reverse();
const pastFamilyCarsReversed = pastFamilyCars.slice().reverse();
const currentKensCarsReversed = currentKensCars.slice().reverse();
const currentFamilyCarsReversed = currentFamilyCars.slice().reverse();

interface CarDisplayProps {
  hideFamily: boolean;
  hideKen: boolean;
}

const CarDisplay = memo(({ hideFamily, hideKen }: CarDisplayProps) => (
  <Grid container spacing={2}>
    {!hideKen && (
      <Grid size={{ xs: 12, md: hideFamily ? 12 : 6 }}>
        <Grid container spacing={2} width="100%">
          <Grid size={{ xs: 12, md: hideFamily ? 6 : 12, xxl: 6 }}>
            <ExpandableCard title="Ken's Cars" backgroundColor="black">
              {currentKensCarsReversed.map((car, i) => (
                <CarCard isK car={car} key={`k-${car.title}-cur-${i}`} />
              ))}
            </ExpandableCard>
          </Grid>
          <Grid size={{ xs: 12, md: hideFamily ? 6 : 12, xxl: 6 }}>
            <ExpandableCard
              title="Ken's Previous Cars"
              backgroundColor={red.A700}
            >
              {pastKensCarsReversed.map((car, i) => (
                <CarCard isK car={car} key={`k-${car.title}-past-${i}`} />
              ))}
            </ExpandableCard>
          </Grid>
        </Grid>
      </Grid>
    )}
    {!hideFamily && (
      <Grid size={{ xs: 12, md: hideKen ? 12 : 6 }}>
        <Grid container spacing={2} width="100%">
          <Grid size={{ xs: 12, md: hideKen ? 6 : 12, xxl: 6 }}>
            <ExpandableCard title="Family Cars" backgroundColor="black">
              {currentFamilyCarsReversed.map((car, i) => (
                <CarCard car={car} key={`f-${car.title}-cur-${i}`} />
              ))}
            </ExpandableCard>
          </Grid>
          <Grid size={{ xs: 12, md: hideKen ? 6 : 12, xxl: 6 }}>
            <ExpandableCard
              title="Family's Previous Cars"
              backgroundColor={red.A700}
            >
              {pastFamilyCarsReversed.map((car, i) => (
                <CarCard car={car} key={`f-${car.title}-past-${i}`} />
              ))}
            </ExpandableCard>
          </Grid>
        </Grid>
      </Grid>
    )}
  </Grid>
));

CarDisplay.displayName = "CarDisplay";

export default CarDisplay;
