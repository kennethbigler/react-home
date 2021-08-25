import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { HideObject } from './CarChart';

interface CarChartControlsProps {
  hide: HideObject;
  onClick: (key: ShowKey) => () => void;
  vw: number;
}

export type ShowKey = keyof HideObject;

const CarChartControls = React.memo(({ onClick, hide, vw }: CarChartControlsProps) => (
  <div>
    <ButtonGroup color="primary" aria-label="outlined primary button group controlling graph">
      <Button onClick={onClick('displacement')} variant={hide.displacement ? 'contained' : 'outlined'}>Displacement</Button>
      <Button onClick={onClick('torque')} variant={hide.torque ? 'contained' : 'outlined'}>Torque</Button>
      <Button onClick={onClick('MPG')} variant={hide.MPG ? 'contained' : 'outlined'}>MPG</Button>
    </ButtonGroup>
    <ButtonGroup color="primary" aria-label="outlined primary button group controlling graph part 2">
      <Button onClick={onClick('horsepower')} variant={hide.horsepower ? 'contained' : 'outlined'}>Horsepower</Button>
      <Button onClick={onClick('weight')} variant={hide.weight ? 'contained' : 'outlined'}>Weight</Button>
      <Button onClick={onClick('powerToWeight')} variant={hide.powerToWeight ? 'contained' : 'outlined'} aria-label="power to weight ratio">{vw >= 435 ? 'Power-to-Weight' : 'PTW'}</Button>
    </ButtonGroup>
  </div>
));

export default CarChartControls;
