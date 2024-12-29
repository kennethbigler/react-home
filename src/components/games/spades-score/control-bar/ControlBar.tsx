import InfoPopup from "../../../common/info-popover/InfoPopup";
import { Bids } from "../../../../jotai/spades-score-atom";
import AddBid from "./AddBid";

interface ControlBarProps {
  initials: [string, string, string, string];
  lastBid: Bids;
  onBidSave: (bids: Bids) => void;
}

const ControlBar = ({ initials, lastBid, onBidSave }: ControlBarProps) => {
  return (
    <div className="flex-container" style={{ margin: "20px 0" }}>
      <AddBid initials={initials} onBidSave={onBidSave} />
      <InfoPopup title="+ Score" onSave={() => {}}>
        <div>{lastBid[0].bid}</div>
      </InfoPopup>
    </div>
  );
};

export default ControlBar;
