import React from 'react';
import PropTypes from 'prop-types';
import { ExpandableCard } from '../../common/ExpandableCard';
import { Timeline, TIMELINE_TITLE } from '../../common/timeline/Timeline';
// Parents: Work

/** function to generate timeline card */
export const TimelineCard = props => {
  const { onTouchTap, workExp, expanded } = props;

  return (
    <ExpandableCard
      expanded={expanded[TIMELINE_TITLE]}
      onExpandChange={expanded => onTouchTap(TIMELINE_TITLE, expanded)}
      title={TIMELINE_TITLE}
      subtitle="September 2011 - Present"
    >
      <Timeline data={workExp} />
    </ExpandableCard>
  );
};

TimelineCard.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  onTouchTap: PropTypes.func.isRequired,
  workExp: PropTypes.array.isRequired,
  expanded: PropTypes.object.isRequired
};
