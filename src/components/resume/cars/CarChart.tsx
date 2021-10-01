import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis, YAxis,
  Line, Legend,
} from 'recharts';
import {
  red, orange, green, blue,
} from '@material-ui/core/colors/';
import { processData, CarStats } from '../../../constants/cars';

export interface HideObject {
  MPG?: boolean;
  horsepower?: boolean;
  weight?: boolean;
  powerToWeight?: boolean;
  family?: boolean;
  ken?: boolean;
}

export interface CarChartProps {
  showAnimation: boolean;
  hide: HideObject;
  vw: number;
  data: CarStats[];
}

const CarChart = React.memo(({
  data, showAnimation, hide, vw,
}: CarChartProps) => {
  const processedData = processData(data);

  return (
    <ResponsiveContainer width="100%" height={720}>
      <LineChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={vw >= 930 ? 'short' : 'char'} interval="preserveStartEnd" reversed />
        <YAxis domain={['dataMin', 'dataMax']} tickCount={6} width={28} hide />
        {!hide.MPG
          && <Line strokeWidth={2} type="monotone" dot={false} isAnimationActive={showAnimation} dataKey="MPG" stroke={green[500]} />}
        {!hide.horsepower
          && <Line strokeWidth={2} type="monotone" dot={false} isAnimationActive={showAnimation} dataKey="horsepower" stroke={red[500]} />}
        {!hide.weight
          && <Line strokeWidth={2} type="monotone" dot={false} isAnimationActive={showAnimation} dataKey="weight" stroke={blue[500]} />}
        {!hide.powerToWeight
          && <Line strokeWidth={2} type="monotone" dot={false} isAnimationActive={showAnimation} dataKey="powerToWeight" stroke={orange[500]} />}
        <Legend verticalAlign="top" />
      </LineChart>
    </ResponsiveContainer>
  );
});

export default CarChart;
