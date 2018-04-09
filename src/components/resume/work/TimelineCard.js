// react
import React from 'react';
import PropTypes from 'prop-types';
// components
import { ExpandableCard } from '../../common/ExpandableCard';
import { Timeline, TIMELINE_TITLE } from '../../common/timeline/Timeline';
// constants
import workExp from '../../../constants/work';
// Parents: Work

/** function to generate timeline card */
export const TimelineCard = props => {
  const { workExp } = props;

  return (
    <ExpandableCard title={TIMELINE_TITLE} subtitle="September 2011 - Present">
      <Timeline data={workExp} />
    </ExpandableCard>
  );
};

TimelineCard.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  workExp: PropTypes.array
};

TimelineCard.defaultProps = {
  workExp
};
