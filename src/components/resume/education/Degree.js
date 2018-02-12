import React from 'react';
import PropTypes from 'prop-types';
import { Year } from './Year';
import { ExpandableCard } from '../../common/ExpandableCard';
// Parents: Work

/** render code for each degree */
export const Degree = props => {
  const { degree, expanded, onTouchTap } = props;

  const handleChange = expanded => onTouchTap(degree.degree, expanded);
  const title = `${degree.degree}${degree.major ? ` in ${degree.major}` : ''}`;
  const subtitle = degree.gpa
    ? `GPA: ${degree.gpa} - Graduation: ${degree.graduation}`
    : degree.subtitle;

  return (
    <ExpandableCard
      expanded={expanded[degree.degree]}
      onExpandChange={handleChange}
      title={title}
      subtitle={subtitle}
    >
      {degree.years.map(year => (
        <Year key={year.year} year={year} len={degree.years.length} />
      ))}
    </ExpandableCard>
  );
};

Degree.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  degree: PropTypes.object.isRequired,
  expanded: PropTypes.object.isRequired,
  onTouchTap: PropTypes.func.isRequired
};
