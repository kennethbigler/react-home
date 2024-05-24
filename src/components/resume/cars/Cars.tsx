import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useRecoilState } from "recoil";
import TimelineCard from "../../common/timeline-card";
import dateObj from "../../../apis/DateHelper";
import cars, { kensCars, familyCars } from "../../../constants/cars";
import CarCard from "./CarCard";
import CarChart from "./CarChart";
import CarSankeyGraph from "./CarSankeyGraph";
import CarChartControls from "./CarChartControls";
import ExpandableCard from "../../common/expandable-card";
import themeAtom from "../../../recoil/theme-atom";

const Cars = () => {
  const [theme] = useRecoilState(themeAtom);
  const [hideFamily, setHideFamily] = React.useState(false);
  const [hideKen, setHideKen] = React.useState(false);

  const color = theme.mode === "light" ? "black" : "white";

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
    data = familyCars;
  } else if (hideFamily) {
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
      <CarSankeyGraph color={color} />
      <CarChartControls
        onClick={handleClick}
        hideKen={hideKen}
        hideFamily={hideFamily}
      />
      <CarChart data={data} color={color} />
      <Grid container spacing={2}>
        {!hideKen && (
          <Grid item sm={12} md={hideFamily ? 12 : 6}>
            <ExpandableCard title="Ken's Cars">
              {kensCars.map((car, i) => (
                <CarCard car={car} key={`k-${car.title}-${i}`} />
              ))}
            </ExpandableCard>
          </Grid>
        )}
        {!hideFamily && (
          <Grid item sm={12} md={hideKen ? 12 : 6}>
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
