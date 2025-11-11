import { useAtomValue } from "jotai";
import InfoPopup from "../../../common/info-popover/InfoPopup";
import StatsBagsChart from "./StatsBagsChart";
import themeAtom from "../../../../jotai/theme-atom";
import { getChipColor } from "../spadesHelpers";
import spadesAtom from "../../../../jotai/spades-atom";
import StatsNilChart from "./StatsNilsChart";
import { Avatar, Chip, Typography } from "@mui/material";

interface ShowStatsProps {
  initials: string;
}

const ShowStats = ({ initials }: ShowStatsProps) => {
  const theme = useAtomValue(themeAtom);
  const { total1, total2, nils, lifeBags, missedBids } =
    useAtomValue(spadesAtom);
  const color = theme.mode === "light" ? "black" : "white";

  return (
    <InfoPopup title="Stats" buttonVariant="outlined" buttonColor="success">
      <>
        <div className="flex-container" style={{ paddingBottom: 15 }}>
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
        <StatsBagsChart
          color={color}
          initials={initials}
          lifeBags={lifeBags}
          missedBids={missedBids}
        />
        <StatsNilChart color={color} initials={initials} nils={nils} />
      </>
    </InfoPopup>
  );
};

export default ShowStats;
