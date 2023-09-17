import React from "react";
import { Sankey, Tooltip } from "recharts";
import { cruiseData } from "../../../constants/travel";
import SankeyNode from "./SankeyNode";

const CruiseCharts = () => {
  const cruiseRef = React.useRef<HTMLDivElement>(null);
  const [cruiseWidth, setCruiseWidth] = React.useState(0);

  React.useEffect(() => {
    const getDimensions = () => cruiseRef.current?.offsetWidth || 0;

    if (cruiseRef) {
      setCruiseWidth(getDimensions());
    }

    const handleResize = () => {
      setCruiseWidth(getDimensions());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [cruiseRef]);

  return (
    <div style={{ width: "100%" }} ref={cruiseRef}>
      <Sankey
        width={cruiseWidth}
        height={450}
        data={cruiseData}
        node={SankeyNode}
        nodePadding={25}
        margin={{ top: 20, bottom: 20 }}
      >
        <Tooltip />
      </Sankey>
    </div>
  );
};

export default CruiseCharts;
