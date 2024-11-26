import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";

export interface Car {
  owned: string;
  story: string;
  src: string;
  title: string;
  transmission: string;
  horsepower: number;
}
interface CarCardProps {
  car: Car;
}

const containerStyles: React.CSSProperties = {
  maxWidth: 1488,
  margin: "auto",
  marginTop: 20,
  width: "100%",
};
const imgStyles: React.CSSProperties = {
  width: "100%",
  maxWidth: "30em",
  float: "right",
};

const CarCard = ({ car }: CarCardProps) => (
  <Card style={containerStyles}>
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, sm: 8 }}>
        <CardContent>
          <Typography variant="h4" component="h3">
            <strong style={{ paddingRight: 20 }}>{`(${car.owned})`}</strong>
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
          <hr aria-hidden />
          <Typography>{car.story}</Typography>
        </CardContent>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <img src={car.src} alt="" style={imgStyles} />
      </Grid>
    </Grid>
  </Card>
);

export default CarCard;
