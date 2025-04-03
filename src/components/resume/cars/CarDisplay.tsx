import * as React from "react";
import Grid from "@mui/material/Grid";
import {
  pastKensCars,
  currentKensCars,
  pastFamilyCars,
  currentFamilyCars,
} from "../../../constants/cars";
import CarCard from "./CarCard";
import ExpandableCard from "../../common/expandable-card";

const pastKensCarsReversed = pastKensCars.slice().reverse();
const pastFamilyCarsReversed = pastFamilyCars.slice().reverse();
const currentKensCarsReversed = currentKensCars.slice().reverse();
const currentFamilyCarsReversed = currentFamilyCars.slice().reverse();

interface CarDisplayProps {
  hideFamily: boolean;
  hideKen: boolean;
}

const CarDisplay = React.memo(({ hideFamily, hideKen }: CarDisplayProps) => (
  <Grid container spacing={2}>
    {!hideKen && (
      <Grid size={{ xs: 12, md: hideFamily ? 12 : 6 }}>
        <Grid container spacing={2} width="100%">
          {/* @ts-expect-error - custom breakpoints */}
          <Grid size={{ xs: 12, md: hideFamily ? 6 : 12, xxl: 6 }}>
            <ExpandableCard title="Ken's Cars">
              {currentKensCarsReversed.map((car, i) => (
                <CarCard car={car} key={`k-${car.title}-cur-${i}`} />
              ))}
            </ExpandableCard>
          </Grid>
          {/* @ts-expect-error - custom breakpoints */}
          <Grid size={{ xs: 12, md: hideFamily ? 6 : 12, xxl: 6 }}>
            <ExpandableCard title="Ken's Previous Cars">
              {pastKensCarsReversed.map((car, i) => (
                <CarCard car={car} key={`k-${car.title}-past-${i}`} />
              ))}
            </ExpandableCard>
          </Grid>
        </Grid>
      </Grid>
    )}
    {!hideFamily && (
      <Grid size={{ xs: 12, md: hideKen ? 12 : 6 }}>
        <Grid container spacing={2} width="100%">
          {/* @ts-expect-error - custom breakpoints */}
          <Grid size={{ xs: 12, md: hideKen ? 6 : 12, xxl: 6 }}>
            <ExpandableCard title="Family Cars">
              {currentFamilyCarsReversed.map((car, i) => (
                <CarCard car={car} key={`f-${car.title}-cur-${i}`} />
              ))}
            </ExpandableCard>
          </Grid>
          {/* @ts-expect-error - custom breakpoints */}
          <Grid size={{ xs: 12, md: hideKen ? 6 : 12, xxl: 6 }}>
            <ExpandableCard title="Family's Previous Cars">
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
