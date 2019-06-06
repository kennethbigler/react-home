import React, { memo } from 'react';
import Typography from '@material-ui/core/Typography';
import map from 'lodash/map';
import cars from '../../../constants/cars';
import CarCard from './CarCard';

const Cars = memo(() => (
  <div>
    <Typography variant="h2">{'Ken\'s Cars'}</Typography>
    {map(cars, car => (<CarCard car={car} key={car.makeModel} />))}
  </div>
));

export default Cars;
