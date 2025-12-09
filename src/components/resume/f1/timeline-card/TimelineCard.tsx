import { memo } from "react";
import ExpandableCard from "../../../common/expandable-card";
import Row from "../../../common/timeline-parts/Row";
import { getYearMarkers, getSegments } from "./timelineHelpers";
import { ContractData, MERCEDES_HEX } from "../../../../constants/f1";

interface TimelineCardProps {
  /** reads "car" from each array entry and creates segments */
  data: ContractData[];
}

/** TimelineCard  ->  Row  ->  Segment
 **                       |->  YearMarkers */
const TimelineCard = memo(({ data }: TimelineCardProps) => {
  // track elements added already
  const added: boolean[] = [];

  return (
    <ExpandableCard
      backgroundColor={MERCEDES_HEX}
      title="F1 Team History"
      subtitle="Drivers over 100 points in 2025"
      inverted
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
});

TimelineCard.displayName = "TimelineCard";

export default TimelineCard;
