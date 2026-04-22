import { Bids } from "../../../../jotai/spades-atom";
import AddBid from "./AddBid";
import AddPenalty from "./AddPenalty";
import AddScore from "./AddScore";
import ShowStats from "./ShowStats";

interface ControlBarProps {
  blindTrade: number;
  first: number;
  initials: string;
  scoreText: string;
  showPenalty: boolean;
  lastBid: Bids;
  onBidSave: (bids: Bids) => void;
  onPenalty: (team: number) => () => void;
  onScoreSave: (mades: [number, number, number, number]) => void;
}

const ControlBar = ({
  blindTrade,
  first,
  initials,
  scoreText,
  showPenalty,
  lastBid,
  onBidSave,
  onPenalty,
  onScoreSave,
}: ControlBarProps) => (
  <div className="flex-container" style={{ margin: "20px 0" }}>
    <AddBid
      blindTrade={blindTrade}
      first={first}
      initials={initials}
      scoreText={scoreText}
      onBidSave={onBidSave}
    />
    {showPenalty && <AddPenalty initials={initials} onPenalty={onPenalty} />}
    <ShowStats initials={initials} />
    <AddScore initials={initials} lastBid={lastBid} onScoreSave={onScoreSave} />
  </div>
);

export default ControlBar;
