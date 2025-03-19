import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import InfoPopup from "../../../common/info-popover/InfoPopup";

interface ShowStatsProps {
  initials: string;
  overBids: [number, number, number, number];
}

const ShowStats = ({ initials, overBids }: ShowStatsProps) => (
  <InfoPopup title="Stats" buttonVariant="outlined" buttonColor="success">
    <div className="flex-container">
      {[0, 1, 2, 3].map((i: number) => (
        <Chip
          key={i}
          avatar={<Avatar>{initials[i]}</Avatar>}
          label={`${overBids[i]}💰`}
        />
      ))}
    </div>
  </InfoPopup>
);

export default ShowStats;
