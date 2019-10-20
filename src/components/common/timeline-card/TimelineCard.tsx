import React from 'react';
import moment, { Moment } from 'moment';
import grey from '@material-ui/core/colors/grey';
import ExpandableCard from '../expandable-card';
import { Timeline, TIMELINE_TITLE, DataEntry } from './Timeline';
import workExperience from '../../../constants/work';

interface TimelineCardProps {
  backgroundColor?: string;
  data: DataEntry[];
  title?: string;
  selector?: string;
  start: Moment;
  end: Moment;
}

const DATE_FORMAT = 'MMMM YYYY';

/* TimelineCard  ->  Timeline  ->  Row  ->  Segment
 *                                     |->  YearMarkers */
/** function to generate timeline card */
const TimelineCard: React.FC<TimelineCardProps> = (props: TimelineCardProps) => {
  const {
    data, backgroundColor, title, selector,
    start, end,
  } = props;

  return (
    <ExpandableCard
      backgroundColor={backgroundColor}
      subtitle={`${start.format(DATE_FORMAT)} - ${end.format(DATE_FORMAT)}`}
      title={title}
    >
      <Timeline
        data={data}
        selector={selector || ''}
        start={start}
        end={end}
      />
    </ExpandableCard>
  );
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
