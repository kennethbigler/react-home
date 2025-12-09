import { useState } from "react";
import TimelineCard from "./timeline-card/TimelineCard";
import {
  cars,
  currentKensCars,
  hideFamilyCars,
  hideKenCars,
} from "../../../constants/cars";
import CarChartControls from "./CarChartControls";
import CarGraphs from "./graphs/CarGraphs";
import CarDisplay from "./CarDisplay";
import { Typography } from "@mui/material";

const Cars = () => {
  const [hideFamily, setHideFamily] = useState(false);
  const [hideKen, setHideKen] = useState(false);
  const [active, setActive] = useState(currentKensCars[0]);

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
