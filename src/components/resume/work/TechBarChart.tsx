import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, CartesianGrid, Tooltip,
} from 'recharts';
import sortBy from 'lodash/sortBy';
import { withTheme, Theme } from '@material-ui/core/styles';
import dateObj from '../../../apis/DateHelper';
import languageExp from '../../../constants/languages';

interface TechBarChartProps {
  theme: Theme;
}

const TechBarChart: React.FC<TechBarChartProps> = React.memo((props: TechBarChartProps) => {
  const data = React.useMemo(() => {
    const storageData = languageExp.map((obj) => ({
      name: window.innerWidth < 1200 ? obj.short : obj.company,
      months: dateObj(obj.end).diff(obj.start, 'month'),
    }));
    return sortBy(storageData, ['months']).reverse();
  }, []);

  const { theme } = props;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <Tooltip
          formatter={(months: string | number | React.ReactText[], name: string, prop): [string, string] => {
            // FYI: name === 'months'
            const displayMonths = months as number % 12;
            const years = Math.floor(months as number / 12);

            const label = prop.payload.name;
            const value = (years ? `${years}y ` : '') + (displayMonths ? `${displayMonths}m` : '');

            return [value, label];
          }}
        />
        <Bar dataKey="months" fill={theme.palette.secondary.main} />
      </BarChart>
    </ResponsiveContainer>
  );
});

export default withTheme(TechBarChart);
