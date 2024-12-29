import { Bids } from "../../../../jotai/spades-score-atom";
import AddBid from "./AddBid";
import AddScore from "./AddScore";

interface ControlBarProps {
  initials: [string, string, string, string];
  lastBid: Bids;
  onBidSave: (bids: Bids) => void;
  onScoreSave: (mades: [number, number, number, number]) => void;
}

const ControlBar = ({
  initials,
  lastBid,
  onBidSave,
  onScoreSave,
}: ControlBarProps) => {
  return (
    <div className="flex-container" style={{ margin: "20px 0" }}>
      <AddBid initials={initials} onBidSave={onBidSave} />
      <AddScore
        initials={initials}
        lastBid={lastBid}
        onScoreSave={onScoreSave}
      />
    </div>
  );
};

export default ControlBar;
