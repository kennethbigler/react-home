import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, CartesianGrid, Tooltip, TooltipFormatter, TooltipPayload,
} from 'recharts';
import sortBy from 'lodash/sortBy';
import { useTheme } from '@material-ui/core/styles';
import dateObj from '../../../apis/DateHelper';
import languageExp from '../../../constants/languages';

type Months = string | number | React.ReactText[];

const storageData = languageExp.map((obj) => ({
  name: window.innerWidth < 1200 ? obj.short : obj.company,
  months: dateObj(obj.end).diff(obj.start, 'month'),
}));
const data = sortBy(storageData, ['months']).reverse();

export const tooltipFormatter: TooltipFormatter = (months: Months, name: string, entry: TooltipPayload): [string, string] => {
  const displayMonths = months as number % 12;
  const years = Math.floor(months as number / 12);

  const label = entry.payload.name;
  const value = (years ? `${years}y ` : '') + (displayMonths ? `${displayMonths}m` : '');

  return [value, label];
};

const TechBarChart: React.FC = React.memo(() => {
  const { palette: { secondary: { main }}} = useTheme();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <Tooltip formatter={tooltipFormatter} />
        <Bar dataKey="months" fill={main} />
      </BarChart>
    </ResponsiveContainer>
  );
});

export default TechBarChart;
