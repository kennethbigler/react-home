import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Legend,
} from 'recharts';
import {
  red, yellow, orange, green, blue, purple,
} from '@material-ui/core/colors/';
import { crunchedData } from '../../../constants/cars';

const Cars = React.memo(() => (
  <ResponsiveContainer width="100%" height={650}>
    <LineChart data={crunchedData}>
      <XAxis dataKey="short" interval="preserveStartEnd" reversed />
      <YAxis
        hide
        width={40}
        tickLine={false}
        domain={['dataMin', 'dataMax']}
        allowDecimals={false}
      />
      <Line strokeWidth={2} type="monotone" dot={false} dataKey="displacement" stroke={red[500]} />
      <Line strokeWidth={2} type="monotone" dot={false} dataKey="horsepower" stroke={yellow[500]} />
      <Line strokeWidth={2} type="monotone" dot={false} dataKey="MPG" stroke={orange[500]} />
      <Line strokeWidth={2} type="monotone" dot={false} dataKey="torque" stroke={green[500]} />
      <Line strokeWidth={2} type="monotone" dot={false} dataKey="weight" stroke={blue[500]} />
      <Line strokeWidth={2} type="monotone" dot={false} dataKey="powerToWeight" stroke={purple[500]} />
      <Legend verticalAlign="top" height={36} />
    </LineChart>
  </ResponsiveContainer>
));

export default Cars;
