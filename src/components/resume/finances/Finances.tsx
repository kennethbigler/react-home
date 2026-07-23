import { Typography } from "@mui/material";
import CompCalculator from "./comp-calc/CompCalculator";
import TabGroup from "../../common/tab-group/TabGroup";
import Budgeting from "./budgeting/Budgeting";
import NetWorth from "./net-worth/NetWorth";

const Finances = () => (
  <div>
    <Typography variant="h2" component="h1">
      Finances
    </Typography>

    <TabGroup
      label="Finances sections"
      tabs={[
        { label: "Comp Calculator", content: <CompCalculator /> },
        { label: "Budgeting", content: <Budgeting /> },
        { label: "Net Worth", content: <NetWorth /> },
      ]}
    />
  </div>
);

export default Finances;
