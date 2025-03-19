import InfoPopup from "../../../common/info-popover/InfoPopup";
import StatsBagsChart from "./StatsBagsChart";
import { useAtomValue } from "jotai";
import themeAtom from "../../../../jotai/theme-atom";

interface ShowStatsProps {
  initials: string;
  overBids: [number, number, number, number, number];
}

const ShowStats = ({ initials, overBids }: ShowStatsProps) => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  return (
    <InfoPopup title="Stats" buttonVariant="outlined" buttonColor="success">
      <StatsBagsChart initials={initials} overBids={overBids} color={color} />
    </InfoPopup>
  );
};

export default ShowStats;
