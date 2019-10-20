import React, { memo } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Legend,
} from 'recharts';
import {
  blue, orange, purple, yellow,
} from '@material-ui/core/colors/';
import { muscleCars } from '../../../constants/cars';

const Cars = memo(() => (
  <ResponsiveContainer width="100%" height={650}>
    <LineChart data={muscleCars}>
      <XAxis dataKey="year" interval="preserveStartEnd" />
      <YAxis
        width={40}
        orientation="right"
        tickLine={false}
        domain={['dataMin', 'dataMax + 1']}
        interval="preserveStartEnd"
        allowDecimals={false}
        reversed
      />
      <Line type="monotone" dot={false} dataKey="corvette" stroke={yellow.A700} />
      <Line type="monotone" dot={false} dataKey="mustang" stroke={blue.A100} />
      <Line type="monotone" dot={false} dataKey="camaro" stroke={orange.A700} />
      <Line type="monotone" dot={false} dataKey="challenger" stroke={purple.A200} />
      <Legend verticalAlign="top" height={36} />
    </LineChart>
  </ResponsiveContainer>
));

export default Cars;
