import React, { PureComponent } from 'react';
import types from 'prop-types';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import { withTheme } from '@material-ui/core/styles';
import languageExp from '../../../constants/languages';

class TechBarChart extends PureComponent {
  static propTypes = {
    theme: types.shape({
      palette: types.shape({
        primary: types.shape({
          main: types.string.isRequired,
        }).isRequired,
      }).isRequired,
    }),
  }

  constructor(props) {
    super(props);

    const data = map(languageExp, obj => ({
      name: window.innerWidth < 1200 ? obj.short : obj.company,
      months: moment(obj.end).diff(obj.start, 'month'),
    }));

    this.state = { data: sortBy(data, ['months']).reverse() };
  }

  render() {
    const { theme } = this.props;
    const { data } = this.state;
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <Tooltip
            formatter={(months, name, props) => {
              // FYI: name === 'months'
              const displayMonths = months % 12;
              const years = Math.floor(months / 12);

              const label = props.payload.name;
              const value = (years ? `${years}y ` : '') + (displayMonths ? `${displayMonths}m` : '');

              return [value, label];
            }}
          />
          <Bar dataKey="months" fill={theme.palette.secondary.main} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

export default withTheme(TechBarChart);
