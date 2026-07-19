import { Typography } from "@mui/material";
import CompCalculator from "./comp-calc/CompCalculator";
import TabGroup from "../../common/tab-group/TabGroup";
import Budgeting from "./budgeting/Budgeting";

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
      ]}
    />
  </div>
);

export default Finances;
