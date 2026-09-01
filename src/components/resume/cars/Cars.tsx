import { useCallback, useState } from "react";
import TimelineCard from "./timeline-card/TimelineCard";
import {
  cars,
  currentKensCars,
  hideFamilyCars,
  hideKenCars,
} from "@/constants/cars";
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

  const handleHideClick = useCallback((isKen: boolean) => {
    if (isKen) {
      setHideKen((prevHideKen) => !prevHideKen);
      setHideFamily(false);
    } else {
      setHideFamily((prevHideFamily) => !prevHideFamily);
      setHideKen(false);
    }
  }, []);

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
        onHideClick={handleHideClick}
        hideKen={hideKen}
        hideFamily={hideFamily}
      />
      <TimelineCard
        data={data}
        useKStart={hideFamily}
        useFStart={hideKen}
        onClick={handleSegmentClick}
      />
      <CarGraphs active={active} data={data} />
      <CarDisplay hideFamily={hideFamily} hideKen={hideKen} />
    </>
  );
};

export default Cars;
