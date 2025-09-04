import Typography from "@mui/material/Typography";
import StandingsLine from "./charts/StandingsLine";
import { useAtomValue } from "jotai";
import themeAtom from "../../../jotai/theme-atom";
import BudgetSankey from "./charts/BudgetSankey";
import f1 from "../../../images/f1-cost-breakdown.jpg";

const F1 = () => {
  const theme = useAtomValue(themeAtom);
  const color = theme.mode === "light" ? "black" : "white";

  return (
    <>
      <Typography variant="h2" component="h1">
        F1
      </Typography>
      <StandingsLine color={color} />
      <BudgetSankey color={color} />
      <img src={f1} alt="F1 Cost Breakdown" />
    </>
  );
};

export default F1;
