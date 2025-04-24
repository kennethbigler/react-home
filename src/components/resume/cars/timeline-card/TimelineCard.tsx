import { grey } from "@mui/material/colors";
import { FormatOutput } from "../../../../apis/DateHelper";
import ExpandableCard from "../../../common/expandable-card";
import Row from "./Row";
import {
  START,
  END,
  monthSort,
  getYearMarkers,
  getSegments,
} from "./timelineHelpers";
import { CarEntry } from "../../../../constants/cars";

interface TimelineCardProps {
  /** reads "car" from each array entry and creates segments */
  data: CarEntry[];
}

const DATE_FORMAT: FormatOutput = "MMMM Y";

/* TimelineCard  ->  Timeline  ->  Row  ->  Segment
 *                                     |->  YearMarkers */
/** function to generate timeline card */
const TimelineCard = ({ data: propsData }: TimelineCardProps) => {
  // get immutable data from props and sort by start date
  const data: CarEntry[] = [...propsData].sort(monthSort);
  // track elements added already
  const added: boolean[] = [];

  return (
    <ExpandableCard
      backgroundColor={grey[800]}
      subtitle={`${START.format(DATE_FORMAT)} - ${END.format(DATE_FORMAT)}`}
      title="Ken's Cars"
    >
      <div style={{ width: "100%", paddingBottom: 7 }}>
        <Row key={data.length} segments={getYearMarkers()} yearMarkers />
        {data.map((elm, i) => {
          const segments = getSegments(data, added, elm, i);
          return segments.length ? (
            <Row key={i} segments={segments} first={i === 0} />
          ) : null;
        })}
      </div>
    </ExpandableCard>
  );
};

export default TimelineCard;
