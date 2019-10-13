import React, { memo, Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import map from 'lodash/map';
import cars from '../../../constants/cars';
import CarCard from './CarCard';
import CarChart from './CarChart';

const Cars = memo(() => (
  <>
    <Typography variant="h2">{'Ken\'s Cars'}</Typography>
    {map(cars, (car) => (<CarCard car={car} key={car.makeModel} />))}
    <br />
    <hr />
    <br />
    <Typography variant="h2">Muscle Cars Compared</Typography>
    <br />
    <CarChart />
  </>
));

export default Cars;
