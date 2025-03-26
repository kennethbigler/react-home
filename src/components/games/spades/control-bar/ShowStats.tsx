import { useAtomValue } from "jotai";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import InfoPopup from "../../../common/info-popover/InfoPopup";
import StatsBagsChart from "./StatsBagsChart";
import themeAtom from "../../../../jotai/theme-atom";
import { getChipColor } from "../helpers";
import spadesAtom from "../../../../jotai/spades-atom";
import { Typography } from "@mui/material";

interface ShowStatsProps {
  initials: string;
  overBids: [number, number, number, number, number];
}

const ShowStats = ({ initials, overBids }: ShowStatsProps) => {
  const theme = useAtomValue(themeAtom);
  const { total1, total2, nils } = useAtomValue(spadesAtom);
  const color = theme.mode === "light" ? "black" : "white";

  return (
    <InfoPopup title="Stats" buttonVariant="outlined" buttonColor="success">
      <>
        <div className="flex-container">
          <Typography>Totals:</Typography>
          <Chip
            avatar={<Avatar>{initials[0] + initials[2]}</Avatar>}
            color={getChipColor(total1, total2)}
            label={total1}
          />
          <Chip
            avatar={<Avatar>{initials[1] + initials[3]}</Avatar>}
            color={getChipColor(total2, total1)}
            label={total2}
          />
        </div>
        <StatsBagsChart initials={initials} overBids={overBids} color={color} />
        <div style={{ textAlign: "center" }}>
          {nils.map((n, i) => (
            <Typography key={i}>
              {`Bid: ${n[0]}, Blind: ${n[1]}, Won: ${n[2]}`}
            </Typography>
          ))}
        </div>
      </>
    </InfoPopup>
  );
};

export default ShowStats;
