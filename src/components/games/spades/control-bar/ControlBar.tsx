import { Bids } from "../../../../jotai/spades-atom";
import AddBid from "./AddBid";
import AddScore from "./AddScore";

interface ControlBarProps {
  first: number;
  initials: [string, string, string, string];
  lastBid: Bids;
  onBidSave: (bids: Bids) => void;
  onScoreSave: (mades: [number, number, number, number]) => void;
}

const ControlBar = ({
  first,
  initials,
  lastBid,
  onBidSave,
  onScoreSave,
}: ControlBarProps) => (
  <div className="flex-container" style={{ margin: "20px 0" }}>
    <AddBid first={first} initials={initials} onBidSave={onBidSave} />
    <AddScore initials={initials} lastBid={lastBid} onScoreSave={onScoreSave} />
  </div>
);

export default ControlBar;
