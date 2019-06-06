import React from 'react';
import types from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = {
  container: {
    maxWidth: 1488,
    margin: 'auto',
    marginTop: 20,
  },
  img: {
    width: '100%',
    maxWidth: '30em',
    float: 'right',
  },
};

const CarCard = (props) => {
  const { car } = props;
  return (
    <Card style={styles.container}>
      <Grid container spacing={1}>
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
  );
};

CarCard.propTypes = {
  car: types.shape({
    owned: types.string.isRequired,
    story: types.string.isRequired,
    src: types.string.isRequired,
    makeModel: types.string.isRequired,
    transmission: types.string.isRequired,
    horsePower: types.number.isRequired,
  }),
};

export default CarCard;
