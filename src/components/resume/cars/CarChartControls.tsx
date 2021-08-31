import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import { HideObject } from './CarChart';

interface CarChartControlsProps {
  hide: HideObject;
  onClick: (key: ShowKey) => () => void;
  vw: number;
}

export type ShowKey = keyof HideObject;

const CarChartControls = React.memo(({ onClick, hide, vw }: CarChartControlsProps) => (
  <div>
    <Typography variant="h4">Hide Data:</Typography>
    <ButtonGroup color="secondary" aria-label="outlined secondary button group controlling graph">
      <Button onClick={onClick('displacement')} variant={hide.displacement ? 'contained' : 'outlined'}>Displacement</Button>
      <Button onClick={onClick('torque')} variant={hide.torque ? 'contained' : 'outlined'}>Torque</Button>
      <Button onClick={onClick('MPG')} variant={hide.MPG ? 'contained' : 'outlined'}>MPG</Button>
    </ButtonGroup>
    <ButtonGroup color="secondary" aria-label="outlined secondary button group controlling graph part 2">
      <Button onClick={onClick('horsepower')} variant={hide.horsepower ? 'contained' : 'outlined'}>Horsepower</Button>
      <Button onClick={onClick('weight')} variant={hide.weight ? 'contained' : 'outlined'}>Weight</Button>
      <Button onClick={onClick('powerToWeight')} variant={hide.powerToWeight ? 'contained' : 'outlined'} aria-label="power to weight ratio">{vw >= 435 ? 'Power-to-Weight' : 'PTW'}</Button>
    </ButtonGroup>
    <ButtonGroup color="secondary" aria-label="outlined secondary button group controlling graph part 3">
      <Button onClick={onClick('family')} variant={hide.family ? 'contained' : 'outlined'}>{vw >= 435 ? "Family's Cars" : 'Fam'}</Button>
      <Button onClick={onClick('ken')} variant={hide.ken ? 'contained' : 'outlined'}>{vw >= 435 ? "Ken's Cars" : 'Ken'}</Button>
    </ButtonGroup>
  </div>
));

export default CarChartControls;
