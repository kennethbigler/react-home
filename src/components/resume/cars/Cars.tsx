import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TimelineCard from "../../common/timeline-card";
import dateObj from "../../../apis/DateHelper";
import cars, { kensCars, familyCars } from "../../../constants/cars";
import CarCard from "./CarCard";
import CarChart, { HideObject } from "./CarChart";
import CarSankeyGraph from "./CarSankeyGraph";
import CarChartControls, { ShowKey } from "./CarChartControls";
import ExpandableCard from "../../common/expandable-card";

const Cars = () => {
  const [showAnimation, setShowAnimation] = React.useState(true);
  const [hide, setHide] = React.useState<HideObject>({});

  const { clientWidth, clientHeight } = document.documentElement;
  const { innerWidth, innerHeight } = window;
  const vw = Math.max(clientWidth, innerWidth, 0);
  const vh = Math.max(clientHeight, innerHeight, 0);

  const handleClick = (key: ShowKey) => () => {
    if (key === "ken" || key === "family") {
      setShowAnimation(true);
    } else {
      setShowAnimation(
        (hide.horsepower && hide.MPG && hide.weight && hide.powerToWeight) ||
          false,
      );
    }
    if (hide[key]) {
      setHide({ ...hide, [key]: false });
    } else {
      setHide({ ...hide, [key]: true });
    }
  };

  let data = cars;
  if (hide.ken && hide.family) {
    data = [];
  } else if (hide.ken) {
    data = familyCars;
  } else if (hide.family) {
    data = kensCars;
  }

  return (
    <>
      <Typography variant="h2" component="h1">
        Ken&apos;s Cars
      </Typography>
      <br />
      <TimelineCard
        enableLongTitles
        data={data}
        selector="car"
        start={dateObj("2008-03")}
        title="Ken's Cars"
        yearMarkerFrequency={3}
      />
      <CarSankeyGraph />
      <CarChartControls onClick={handleClick} hide={hide} vw={vw} />
      <CarChart
        showAnimation={showAnimation}
        data={data}
        hide={hide}
        vw={vw}
        vh={vh}
      />
      <Grid container spacing={2}>
        {!hide.ken && (
          <Grid item sm={12} md={hide.family ? 12 : 6}>
            <ExpandableCard title="Ken's Cars">
              {kensCars.map((car, i) => (
                <CarCard car={car} key={`k-${car.title}-${i}`} />
              ))}
            </ExpandableCard>
          </Grid>
        )}
        {!hide.family && (
          <Grid item sm={12} md={hide.ken ? 12 : 6}>
            <ExpandableCard title="Family Cars">
              {familyCars.map((car, i) => (
                <CarCard car={car} key={`f-${car.title}-${i}`} />
              ))}
            </ExpandableCard>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Cars;
