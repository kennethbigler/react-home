import { CSSProperties } from "react";
import { CarEntry } from "../../../constants/cars";
import { DateObj } from "../../../apis/DateHelper";
import { Card, CardContent, Typography, Grid } from "@mui/material";

interface CarCardProps {
  car: CarEntry;
  isK?: boolean;
}

const containerStyles: CSSProperties = {
  maxWidth: 1488,
  margin: "auto",
  marginTop: 20,
  width: "100%",
};
const imgStyles: CSSProperties = {
  width: "100%",
  maxWidth: "30em",
  float: "right",
};

const getStartYear = (
  isK: boolean,
  start: DateObj,
  kStart?: DateObj,
  fStart?: DateObj,
) => {
  const maybeStart = isK ? kStart : fStart;
  return (maybeStart || start).format("YYYY");
};

const getEndYear = (
  isK: boolean,
  end: DateObj,
  kStart?: DateObj,
  fStart?: DateObj,
) => {
  const maybeEnd = isK ? fStart : kStart;
  return (maybeEnd || end).format("YYYY");
};

const CarCard = ({ car, isK = false }: CarCardProps) => (
  <Card style={containerStyles}>
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, sm: 8 }}>
        <CardContent>
          <Typography variant="h4" component="h3">
            <strong style={{ paddingRight: 20 }}>
              ({getStartYear(isK, car.start, car.kStart, car.fStart)}
              {getStartYear(isK, car.start, car.kStart, car.fStart) !==
              getEndYear(isK, car.end, car.kStart, car.fStart)
                ? ` - ${getEndYear(isK, car.end, car.kStart, car.fStart)}`
                : ""}
              )
            </strong>
            {car.title}
          </Typography>
          <hr aria-hidden />
          <Typography
            variant="h5"
            component="h4"
          >{`Horsepower: ${car.horsepower}`}</Typography>
          <Typography
            variant="h5"
            component="h4"
          >{`Transmission: ${car.transmission}`}</Typography>
        </CardContent>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <img src={car.src} alt={car.title} style={imgStyles} />
      </Grid>
    </Grid>
  </Card>
);

export default CarCard;
