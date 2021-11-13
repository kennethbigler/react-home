import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

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
};
const imgStyles: React.CSSProperties = {
  width: "100%",
  maxWidth: "30em",
  float: "right",
};

const CarCard: React.FC<CarCardProps> = ({ car }: CarCardProps) => (
  <Card style={containerStyles}>
    <Grid container spacing={1}>
      <Grid item sm={8} xs={12}>
        <CardContent>
          <Typography variant="h5">
            <strong style={{ paddingRight: 20 }}>{`(${car.owned})`}</strong>
            {car.title}
          </Typography>
          <hr />
          <Typography variant="h6">{`Horsepower: ${car.horsepower}`}</Typography>
          <Typography variant="h6">{`Transmission: ${car.transmission}`}</Typography>
          <hr />
          <Typography>{car.story}</Typography>
        </CardContent>
      </Grid>
      <Grid item sm={4} xs={12}>
        <img src={car.src} alt={car.title} style={imgStyles} />
      </Grid>
    </Grid>
  </Card>
);

export default CarCard;
