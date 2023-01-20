import * as React from "react";
import { Sankey, Tooltip } from "recharts";
import { cruiseData } from "../../../constants/travel";
import SankeyNode from "./SankeyNode";

interface CruiseChartsProps {
  screenWidth: number;
}

const CruiseCharts = ({ screenWidth }: CruiseChartsProps) => (
  <Sankey
    width={screenWidth}
    height={450}
    data={cruiseData}
    node={SankeyNode}
    nodePadding={25}
    margin={{
      top: 20,
      bottom: 20,
    }}
  >
    <Tooltip />
  </Sankey>
);

export default CruiseCharts;
