import InfoPopup from "../../../common/info-popover/InfoPopup";
import bidPage1 from "../../../../images/bridge_bidding_cheat_sheet_1.jpg";
import bidPage2 from "../../../../images/bridge_bidding_cheat_sheet_2.jpg";
import bidPageK from "../../../../images/ken_bridge_betting.jpg";

const BidDialog = () => (
  <InfoPopup title="Bid">
    <img src={bidPage1} alt="Bridge Bidding Cheat Sheet Page 1" width="100%" />
    <img src={bidPage2} alt="Bridge Bidding Cheat Sheet Page 2" width="100%" />
    <img src={bidPageK} alt="Ken Bridge Betting" width="100%" />
  </InfoPopup>
);

export default BidDialog;
