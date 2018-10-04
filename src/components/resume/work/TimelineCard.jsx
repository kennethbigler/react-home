// react
import React from 'react';
import types from 'prop-types';
// components
import grey from '@material-ui/core/colors/grey';
import ExpandableCard from '../../common/ExpandableCard';
import { Timeline, TIMELINE_TITLE } from '../../common/timeline';
// material-ui
// constants
import workExperience from '../../../constants/work';
// Parents: Work

/* function to generate timeline card */
const TimelineCard = (props) => {
  const { experience, backgroundColor, title } = props;

  return (
    <ExpandableCard
      backgroundColor={backgroundColor}
      subtitle="September 2011 - Present"
      title={title}
    >
      <Timeline data={experience} />
    </ExpandableCard>
  );
};

TimelineCard.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  backgroundColor: types.string,
  experience: types.arrayOf(types.object),
  title: types.string,
};

TimelineCard.defaultProps = {
  experience: workExperience,
  backgroundColor: grey[900],
  title: TIMELINE_TITLE,
};

export default TimelineCard;
