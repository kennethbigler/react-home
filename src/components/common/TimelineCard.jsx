// react
import React from 'react';
import types from 'prop-types';
import moment from 'moment';
// components
import grey from '@material-ui/core/colors/grey';
import ExpandableCard from './ExpandableCard';
import { Timeline, TIMELINE_TITLE } from './timeline';
// material-ui
// constants
import workExperience from '../../constants/work';
// Parents: Work

/* function to generate timeline card */
const TimelineCard = (props) => {
  const {
    experience, backgroundColor, title, selector, start,
  } = props;

  return (
    <ExpandableCard
      backgroundColor={backgroundColor}
      subtitle={`${start.format('MMMM YYYY')} - Present`}
      title={title}
    >
      <Timeline data={experience} selector={selector} start={start} />
    </ExpandableCard>
  );
};

TimelineCard.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  backgroundColor: types.string,
  experience: types.arrayOf(types.object),
  title: types.string,
  selector: types.string,
  start: types.shape({
    diff: types.func.isRequired,
  }),
};

TimelineCard.defaultProps = {
  experience: workExperience,
  backgroundColor: grey[900],
  title: TIMELINE_TITLE,
  selector: 'company',
  start: moment('2011-09'),
};

export default TimelineCard;
