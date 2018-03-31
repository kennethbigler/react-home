import React from 'react';
import PropTypes from 'prop-types';
import { ExpandableCard } from '../../common/ExpandableCard';
import { Timeline, TIMELINE_TITLE } from '../../common/timeline/Timeline';
import workExperience from '../../../constants/work';
// Parents: Work

/** function to generate timeline card */
export const TimelineCard = props => {
  const { onTouchTap, workExp, expanded } = props;

  const handleExpandChange =
    onTouchTap && (expanded => onTouchTap(TIMELINE_TITLE, expanded));

  return (
    <ExpandableCard
      expanded={expanded[TIMELINE_TITLE]}
      onExpandChange={handleExpandChange}
      title={TIMELINE_TITLE}
      subtitle="September 2011 - Present"
    >
      <Timeline data={workExp} />
    </ExpandableCard>
  );
};

TimelineCard.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  workExp: PropTypes.array,
  expanded: PropTypes.object,
  onTouchTap: PropTypes.func
};

TimelineCard.defaultProps = {
  expanded: { [TIMELINE_TITLE]: true },
  workExp: workExperience
};
