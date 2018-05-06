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
      backgroundColor={backgroundColor}
      subtitle="September 2011 - Present"
      title={TIMELINE_TITLE}
    >
      <Timeline data={workExp} />
    </ExpandableCard>
  );
};

TimelineCard.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  backgroundColor: types.string,
  workExp: types.array
};

TimelineCard.defaultProps = {
  workExp: workExp,
  backgroundColor: grey900
};
