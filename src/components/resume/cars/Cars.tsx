import * as React from "react";
import Typography from "@mui/material/Typography";
import TimelineCard from "../../common/timeline-card";
import dateObj from "../../../apis/DateHelper";
import cars, {
  pastKensCars,
  currentKensCars,
  pastFamilyCars,
  currentFamilyCars,
} from "../../../constants/cars";
import CarChartControls from "./CarChartControls";
import CarGraphs from "./graphs/CarGraphs";
import CarDisplay from "./CarDisplay";

const Cars = () => {
  const [hideFamily, setHideFamily] = React.useState(false);
  const [hideKen, setHideKen] = React.useState(false);

  const handleClick = (key: string) => () => {
    if (key === "ken") {
      setHideKen(!hideKen);
    } else {
      setHideFamily(!hideFamily);
    }
  };

  let data = cars;
  if (hideKen && hideFamily) {
    data = [];
  } else if (hideKen) {
    data = [...pastFamilyCars, ...currentFamilyCars];
  } else if (hideFamily) {
    data = [...pastKensCars, ...currentKensCars];
  }

  return (
    <>
      <Typography variant="h2" component="h1">
        Ken&apos;s Cars
      </Typography>

      <CarChartControls
        onClick={handleClick}
        hideKen={hideKen}
        hideFamily={hideFamily}
      />

      {data.length > 0 && (
        <TimelineCard
          aria-hidden
          enableLongTitles
          data={data}
          selector="car"
          start={dateObj("2008-03")}
          title="Ken's Cars"
          yearMarkerFrequency={3}
        />
      )}

      <CarGraphs data={data} hideFamily={hideFamily} hideKen={hideKen} />
      <CarDisplay hideFamily={hideFamily} hideKen={hideKen} />
    </>
  );
};

export default Cars;
