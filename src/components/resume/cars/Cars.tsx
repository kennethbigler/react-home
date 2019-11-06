import React, { memo } from 'react';
import Typography from '@material-ui/core/Typography';
import cars from '../../../constants/cars';
import CarCard from './CarCard';
import CarChart from './CarChart';

const Cars = memo(() => (
  <>
    <Typography variant="h2">{'Ken\'s Cars'}</Typography>
    {cars.map((car) => (<CarCard car={car} key={car.makeModel} />))}
    <br />
    <hr />
    <br />
    <Typography variant="h2">Muscle Cars Compared</Typography>
    <br />
    <CarChart />
  </>
));

export default Cars;
