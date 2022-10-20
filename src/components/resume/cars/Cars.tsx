import React from "react";
import Typography from "@mui/material/Typography";
import TimelineCard from "../../common/timeline-card";
import dateObj from "../../../apis/DateHelper";
import cars, { kensCars, familyCars } from "../../../constants/cars";
import CarCard from "./CarCard";
import CarChart, { HideObject } from "./CarChart";
import CarChartControls, { ShowKey } from "./CarChartControls";

const hrStyles: React.CSSProperties = { marginTop: 60, marginBottom: 20 };

const Cars = React.memo(() => {
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
          false
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
      <Typography variant="h2">Ken&apos;s Cars</Typography>
      <br />
      <CarChartControls onClick={handleClick} hide={hide} vw={vw} />
      <CarChart
        showAnimation={showAnimation}
        data={data}
        hide={hide}
        vw={vw}
        vh={vh}
      />
      <TimelineCard
        enableLongTitles
        data={data}
        selector="car"
        start={dateObj("2008-03")}
        title="Ken's Cars"
        yearMarkerFrequency={3}
      />
      {!hide.ken &&
        kensCars.map((car) => <CarCard car={car} key={car.title} />)}
      {!hide.ken && !hide.family && <hr style={hrStyles} />}
      {!hide.family &&
        familyCars.map((car) => <CarCard car={car} key={car.title} />)}
    </>
  );
});

export default Cars;
