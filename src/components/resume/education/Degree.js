import React from 'react';
import types from 'prop-types';
import { Year } from './Year';
import { ExpandableCard } from '../../common/ExpandableCard';
import get from 'lodash/get';
import map from 'lodash/map';
// Parents: Work

/** render code for each degree */
export const Degree = props => {
  const { degree } = props;

  const school = degree.school ? `${degree.school} - ` : '';
  const major = degree.major ? ` in ${degree.major}` : '';
  const minor = degree.minor ? ` ${degree.minor}` : '';
  const title = `${school}${degree.degree}${major}${minor}`;
  const gpa = degree.gpa && `GPA: ${degree.gpa}`;
  const graduation = degree.graduation
    ? ` - Graduation: ${degree.graduation}`
    : '';
  const subtitle = get(degree, 'subtitle', `${gpa}${graduation}`);

  return (
    <ExpandableCard
      backgroundColor={degree.color && degree.color}
      subtitle={subtitle}
      title={title}
    >
      {map(degree.years, year => (
        <Year key={year.year} len={degree.years.length} year={year} />
      ))}
    </ExpandableCard>
  );
};

Degree.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  degree: types.shape({
    school: types.string,
    major: types.string,
    minor: types.string,
    degree: types.string.isRequired,
    gpa: types.oneOfType([types.string, types.number]),
    graduation: types.string,
    subtitle: types.string,
    color: types.string,
    years: types.arrayOf(
      types.shape({
        year: types.string.isRequired
      }).isRequired
    ).isRequired
  }).isRequired
};
