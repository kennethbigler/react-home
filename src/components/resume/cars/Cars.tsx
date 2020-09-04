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
      data={cars.slice().reverse().slice(0, 3)}
      selector="makeModel"
      start={dateObj('2008-03')}
      end={dateObj('2015-02')}
      title="Early Cars (From Parents)"
    />
    <TimelineCard
      data={cars}
      selector="makeModel"
      start={dateObj('2015-02')}
      title="Ken's Cars"
    />
    {cars.map((car) => (<CarCard car={car} key={car.makeModel} />))}
    <hr style={hrStyles} />
    <Typography variant="h2">Muscle Cars Compared</Typography>
    <br />
    <CarChart />
  </>
));

export default Cars;
