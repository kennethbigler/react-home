import React from 'react';
import Typography from '@material-ui/core/Typography';
import TimelineCard from '../../common/timeline-card';
import dateObj from '../../../apis/DateHelper';
import cars from '../../../constants/cars';
import CarCard from './CarCard';
import CarChart, { HideObject } from './CarChart';
import CarChartControls, { ShowKey } from './CarChartControls';

const hrStyles: React.CSSProperties = { marginTop: 60, marginBottom: 20 };

const Cars = React.memo(() => {
  const [showAnimation, setShowAnimation] = React.useState(true);
  const [hide, setHide] = React.useState<HideObject>({});

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

  const handleClick = (key: ShowKey) => () => {
    setShowAnimation((hide.displacement && hide.horsepower && hide.MPG && hide.torque && hide.weight && hide.powerToWeight) || false);
    if (hide[key]) {
      setHide({ ...hide, [key]: false });
    } else {
      setHide({ ...hide, [key]: true });
    }
  };

  return (
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
      <CarChartControls onClick={handleClick} hide={hide} vw={vw} />
      <CarChart showAnimation={showAnimation} hide={hide} vw={vw} />
    </>
  );
});

export default Cars;
