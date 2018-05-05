// react
import React from 'react';
import types from 'prop-types';
// components
import { ExpandableCard } from '../../common/ExpandableCard';
import { Timeline, TIMELINE_TITLE } from '../../common/timeline/';
import { grey900 } from 'material-ui/styles/colors';
// constants
import workExp from '../../../constants/work';
// Parents: Work

/** function to generate timeline card */
export const TimelineCard = props => {
  const { workExp, backgroundColor } = props;

  return (
    <ExpandableCard
      title={TIMELINE_TITLE}
      subtitle="September 2011 - Present"
      backgroundColor={backgroundColor}
    >
      <Timeline data={workExp} />
    </ExpandableCard>
  );
};

TimelineCard.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  workExp: types.array,
  backgroundColor: types.string
};

TimelineCard.defaultProps = {
  workExp: workExp,
  backgroundColor: grey900
};
