import Typography from "@mui/material/Typography";
import StandingsLine from "./charts/StandingsLine";
import { useAtomValue } from "jotai";
import themeAtom from "../../../jotai/theme-atom";
import BudgetSankey from "./charts/BudgetSankey";
import PointsLine from "./charts/PointsLine";
import ExpandableCard from "../../common/expandable-card";

const F1 = () => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  return (
    <>
      <Typography variant="h2" component="h1">
        F1
      </Typography>

      <ExpandableCard title="F1 Standings" backgroundColor="#DC0000">
        <StandingsLine color={color} />
        <PointsLine color={color} />
      </ExpandableCard>

      <BudgetSankey color={color} />
    </>
  );
};

export default F1;
