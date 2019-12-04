import React from 'react';
import Typography from '@material-ui/core/Typography';
import cars from '../../../constants/cars';
import CarCard from './CarCard';
import CarChart from './CarChart';

const hrStyles: React.CSSProperties = {
  marginTop: 60,
  marginBottom: 20,
};

const Cars = React.memo(() => (
  <>
    <Typography variant="h2">{'Ken\'s Cars'}</Typography>
    {cars.map((car) => (<CarCard car={car} key={car.makeModel} />))}
    <hr style={hrStyles} />
    <Typography variant="h2">Muscle Cars Compared</Typography>
    <br />
    <CarChart />
  </>
));

export default Cars;
