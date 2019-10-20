import React from 'react';
import types from 'prop-types';
import moment from 'moment';
import grey from '@material-ui/core/colors/grey';
import ExpandableCard from '../expandable-card';
import { Timeline, TIMELINE_TITLE } from './Timeline';
import workExperience from '../../../constants/work';

const DATE_FORMAT = 'MMMM YYYY';

/* TimelineCard  ->  Timeline  ->  Row  ->  Segment
 *                                     |->  YearMarkers */
/** function to generate timeline card */
const TimelineCard = (props) => {
  const {
    data, backgroundColor, title, selector, start, end,
  } = props;

  return (
    <ExpandableCard
      backgroundColor={backgroundColor}
      subtitle={`${start.format(DATE_FORMAT)} - ${end.format(DATE_FORMAT)}`}
      title={title}
    >
      <Timeline data={data} selector={selector} start={start} end={end} />
    </ExpandableCard>
  );
};

TimelineCard.propTypes = {
  backgroundColor: types.string,
  data: types.arrayOf(types.object),
  title: types.string,
  selector: types.string,
  start: types.shape({
    diff: types.func.isRequired,
    format: types.func.isRequired,
  }),
  end: types.shape({
    diff: types.func.isRequired,
    format: types.func.isRequired,
  }),
};

TimelineCard.defaultProps = {
  data: workExperience,
  backgroundColor: grey[900],
  title: TIMELINE_TITLE,
  selector: 'company',
  start: moment('2011-09'),
  end: moment(),
};

export default TimelineCard;
