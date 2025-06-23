import * as React from "react";
import Typography from "@mui/material/Typography";
import TimelineCard from "./timeline-card";
import {
  cars,
  currentKensCars,
  hideFamilyCars,
  hideKenCars,
} from "../../../constants/cars";
import CarChartControls from "./CarChartControls";
import CarGraphs from "./graphs/CarGraphs";
import CarDisplay from "./CarDisplay";

const Cars = () => {
  const [hideFamily, setHideFamily] = React.useState(false);
  const [hideKen, setHideKen] = React.useState(false);
  const [active, setActive] = React.useState(currentKensCars[0]);

  const handleSegmentClick = (title: string) =>
    cars.forEach((car) => car.title === title && setActive(car));

  const handleHideClick = (isKen: boolean) => () => {
    if (isKen) {
      if (!hideKen && hideFamily) {
        setHideFamily(false);
      }
      setHideKen(!hideKen);
    } else {
      if (!hideFamily && hideKen) {
        setHideKen(false);
      }
      setHideFamily(!hideFamily);
    }
  };

  let data = cars;
  if (hideFamily) {
    data = hideFamilyCars;
  } else if (hideKen) {
    data = hideKenCars;
  }

  return (
    <>
      <Typography variant="h2" component="h1">
        Ken&apos;s Cars
      </Typography>
      <CarChartControls
        onClick={handleHideClick}
        hideKen={hideKen}
        hideFamily={hideFamily}
      />
      <TimelineCard
        data={data}
        useKStart={hideFamily}
        useFStart={hideKen}
        onClick={handleSegmentClick}
      />
      <CarGraphs
        active={active}
        data={data}
        hideFamily={hideFamily}
        hideKen={hideKen}
      />
      <CarDisplay hideFamily={hideFamily} hideKen={hideKen} />
    </>
  );
};

export default Cars;
