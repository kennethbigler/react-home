import { Bids } from "../../../../jotai/spades-atom";
import AddBid from "./AddBid";
import AddPenalty from "./AddPenalty";
import AddScore from "./AddScore";
import ShowStats from "./ShowStats";

interface ControlBarProps {
  blindTrade: number;
  first: number;
  initials: string;
  overBids: [number, number, number, number, number];
  lastBid: Bids;
  showPenalty: boolean;
  onBidSave: (bids: Bids) => void;
  onPenalty: (team: number) => () => void;
  onScoreSave: (mades: [number, number, number, number]) => void;
}

const ControlBar = ({
  blindTrade,
  first,
  initials,
  overBids,
  lastBid,
  showPenalty,
  onBidSave,
  onPenalty,
  onScoreSave,
}: ControlBarProps) => (
  <div className="flex-container" style={{ margin: "20px 0" }}>
    <AddBid
      blindTrade={blindTrade}
      first={first}
      initials={initials}
      onBidSave={onBidSave}
    />
    {showPenalty && <AddPenalty initials={initials} onPenalty={onPenalty} />}
    <ShowStats initials={initials} overBids={overBids} />
    <AddScore initials={initials} lastBid={lastBid} onScoreSave={onScoreSave} />
  </div>
);

export default ControlBar;
