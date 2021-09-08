import React from 'react';
import Typography from '@material-ui/core/Typography';
import TimelineCard from '../../common/timeline-card';
import dateObj from '../../../apis/DateHelper';
import cars, { kensCars, familyCars } from '../../../constants/cars';
import CarCard from './CarCard';
import CarChart, { HideObject } from './CarChart';
import CarChartControls, { ShowKey } from './CarChartControls';

const hrStyles: React.CSSProperties = { marginTop: 60, marginBottom: 20 };

const Cars = React.memo(() => {
  const [showAnimation, setShowAnimation] = React.useState(true);
  const [hide, setHide] = React.useState<HideObject>({});

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

  const handleClick = (key: ShowKey) => () => {
    if (key === 'ken' || key === 'family') {
      setShowAnimation(true);
    } else {
      setShowAnimation((hide.displacement && hide.horsepower && hide.MPG && hide.torque && hide.weight && hide.powerToWeight) || false);
    }
    if (hide[key]) {
      setHide({ ...hide, [key]: false });
    } else {
      setHide({ ...hide, [key]: true });
    }
  };

  let data = cars;
  if (hide.ken && hide.family) {
    data = [];
  } else if (hide.ken) {
    data = familyCars;
  } else if (hide.family) {
    data = kensCars;
  }

  return (
    <>
      <Typography variant="h2">{'Ken\'s Cars'}</Typography>
      <br />
      <CarChartControls onClick={handleClick} hide={hide} vw={vw} />
      <CarChart showAnimation={showAnimation} data={data} hide={hide} vw={vw} />
      <TimelineCard
        data={data}
        selector="title"
        start={dateObj('2008-03')}
        title="Ken's Cars"
        yearMarkerFrequency={3}
      />
      {kensCars.map((car) => (<CarCard car={car} key={car.title} />))}
      <hr style={hrStyles} />
      {familyCars.map((car) => (<CarCard car={car} key={car.title} />))}
    </>
  );
});

export default Cars;
