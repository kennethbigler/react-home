import React from 'react';
import PropTypes from 'prop-types';
import { Year } from './Year';
import { ExpandableCard } from '../../common/ExpandableCard';
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
  const subtitle = gpa ? `${gpa}${graduation}` : degree.subtitle;

  return (
    <ExpandableCard
      title={title}
      subtitle={subtitle}
      backgroundColor={degree.color && degree.color}
    >
      {degree.years.map(year => (
        <Year key={year.year} year={year} len={degree.years.length} />
      ))}
    </ExpandableCard>
  );
};

Degree.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  degree: PropTypes.object.isRequired
};
