import React from "react";
import { Sankey, Tooltip } from "recharts";
import { carSankeyData } from "../../../constants/cars";
import SankeyNode from "./SankeyNode";

const CarSankeyGraph = () => {
  const sankeyRef = React.useRef<HTMLDivElement>(null);
  const [sankeyWidth, setCruiseWidth] = React.useState(0);

  React.useEffect(() => {
    const getDimensions = () => sankeyRef.current?.offsetWidth || 0;

    if (sankeyRef) {
      setCruiseWidth(getDimensions());
    }

    const handleResize = () => {
      setCruiseWidth(getDimensions());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [sankeyRef]);

  return (
    <div style={{ width: "100%" }} ref={sankeyRef}>
      <Sankey
        width={sankeyWidth}
        height={450}
        data={carSankeyData}
        node={SankeyNode}
        nodePadding={25}
        margin={{ top: 20, bottom: 20 }}
      >
        <Tooltip />
      </Sankey>
    </div>
  );
};

export default CarSankeyGraph;
