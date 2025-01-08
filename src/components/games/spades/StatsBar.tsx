import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";

interface StatsBarProps {
  initials: string;
  nils: [number, number, number, number];
  overBids: [number, number, number, number];
}

const StatsBar = ({ initials, nils, overBids }: StatsBarProps) => (
  <div className="flex-container">
    <Chip
      avatar={<Avatar>💰</Avatar>}
      color="warning"
      label={`${initials[0]} ${overBids[0]} | ${initials[1]} ${overBids[1]} | ${initials[2]} ${overBids[2]} | ${initials[3]} ${overBids[3]}`}
    />
    <Chip
      avatar={<Avatar>🚫</Avatar>}
      color="warning"
      label={`${initials[0]} ${nils[0]} | ${initials[1]} ${nils[1]} | ${initials[2]} ${nils[2]} | ${initials[3]} ${nils[3]}`}
    />
  </div>
);

export default StatsBar;
