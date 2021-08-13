import React from 'react';
import Typography from '@material-ui/core/Typography';
import TimelineCard from '../../common/timeline-card';
import dateObj from '../../../apis/DateHelper';
import cars from '../../../constants/cars';
import CarCard from './CarCard';
import CarChart from './CarChart';

const hrStyles: React.CSSProperties = { marginTop: 60, marginBottom: 20 };

const Cars = React.memo(() => (
  <>
    <Typography variant="h2">{'Ken\'s Cars'}</Typography>
    <TimelineCard
      data={cars}
      selector="title"
      start={dateObj('2008-03')}
      title="Ken's Cars"
      yearMarkerFrequency={3}
    />
    {cars.map((car) => (<CarCard car={car} key={car.title} />))}
    <hr style={hrStyles} />
    <Typography variant="h2">Car Stats Compared</Typography>
    <br />
    <CarChart />
  </>
));

export default Cars;
