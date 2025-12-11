import InfoPopup from "../../../../common/info-popover/InfoPopup";
import BiddingTable from "./BiddingTable";

const BidDialog = () => (
  <InfoPopup title="Bid" maxWidth={false}>
    <BiddingTable />
  </InfoPopup>
);

export default BidDialog;
