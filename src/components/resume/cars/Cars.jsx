import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import map from 'lodash/map';
import cars from '../../../constants/cars';

const styles = {
  container: {
    maxWidth: 1488,
    margin: 'auto',
    marginTop: 20,
  },
  img: {
    width: '100%',
    maxWidth: '30em',
  },
};

const Cars = () => (
  <div>
    <Typography variant="h2">{'Ken\'s Cars'}</Typography>
    {map(cars, car => (
      <Card style={styles.container} key={car.makeModel}>
        <Grid container spacing={16}>
          <Grid item sm={8} xs={12}>
            <CardContent>
              <Typography variant="h5">{car.owned}</Typography>
              <hr />
              <Typography variant="h6">{`Horsepower: ${car.horsePower}`}</Typography>
              <Typography variant="h6">{`Transmission: ${car.transmission}`}</Typography>
              <hr />
              <Typography>{car.story}</Typography>
            </CardContent>
          </Grid>
          <Grid item sm={4} xs={12}>
            <img src={car.src} alt={car.makeModel} style={styles.img} />
          </Grid>
        </Grid>
      </Card>
    ))}
  </div>
);

export default Cars;
