import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Legend,
} from 'recharts';
import {
  blue, orange, purple, yellow, red,
} from '@material-ui/core/colors/';
import muscleCars from '../../../constants/muscle-cars';

const Cars = React.memo(() => (
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
      <Line strokeWidth={2} type="monotone" dot={false} dataKey="corvette" stroke={yellow.A700} />
      <Line strokeWidth={2} type="monotone" dot={false} dataKey="mustang" stroke={blue.A100} />
      <Line strokeWidth={2} type="monotone" dot={false} dataKey="camaro" stroke={orange.A700} />
      <Line strokeWidth={2} type="monotone" dot={false} dataKey="challenger" stroke={purple.A200} />
      <Line strokeWidth={2} type="monotone" dot={false} dataKey="camaroDNE" stroke={red.A700} legendType="none" />
      <Line strokeWidth={2} type="monotone" dot={false} dataKey="challengerDNE" stroke={red.A700} legendType="none" />
      <Legend verticalAlign="top" height={36} />
    </LineChart>
  </ResponsiveContainer>
));

export default Cars;
