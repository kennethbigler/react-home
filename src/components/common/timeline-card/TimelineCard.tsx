import React from 'react';
import grey from '@material-ui/core/colors/grey';
import dateObj, { DateObj, FormatOutput } from '../../../apis/DateHelper';
import ExpandableCard from '../expandable-card';
import Timeline, { TIMELINE_TITLE, DataEntry } from './Timeline';
import workExperience from '../../../constants/work';

interface TimelineCardProps {
  /** background color of the expandable card top bar */
  backgroundColor?: string;
  /** reads [selector] from each array entry and creates segments */
  data?: DataEntry[];
  /** title content */
  title?: string;
  /** key to be used to read data */
  selector?: string;
  /** start of the timeline */
  start?: DateObj;
  /** end of the timeline */
  end?: DateObj;
}

const DATE_FORMAT: FormatOutput = 'MMMM Y';

/* TimelineCard  ->  Timeline  ->  Row  ->  Segment
 *                                     |->  YearMarkers */
/** function to generate timeline card */
const TimelineCard = (props: TimelineCardProps): React.ReactElement | null => {
  const {
    data = workExperience,
    backgroundColor = grey[900],
    title = TIMELINE_TITLE,
    selector = 'company',
    start = dateObj('2011-09'),
    end = dateObj(),
  } = props;

  return (
    <ExpandableCard
      backgroundColor={backgroundColor}
      subtitle={`${start.format(DATE_FORMAT)} - ${end.format(DATE_FORMAT)}`}
      title={title}
    >
      <Timeline
        data={data}
        selector={selector}
        start={start}
        end={end}
      />
    </ExpandableCard>
  );
};

export default TimelineCard;
