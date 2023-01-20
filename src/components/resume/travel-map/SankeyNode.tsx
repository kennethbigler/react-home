import * as React from "react";
import { grey } from "@mui/material/colors/";
import { Rectangle, Layer } from "recharts";
import { cruiseData } from "../../../constants/travel";

interface SankeyNodePayload {
  name: string;
  value: number;
}

interface SankeyNodeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  payload: SankeyNodePayload;
}

const SankeyNode = ({
  x,
  y,
  width,
  height,
  index,
  payload,
}: SankeyNodeProps) => {
  const isFirst = payload.name === cruiseData.nodes[0].name;
  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#5192ca"
        fillOpacity="1"
      />
      <text
        textAnchor={isFirst ? "start" : "end"}
        x={isFirst ? x + width + 6 : x - 6}
        y={y + height / 2}
        fontSize="14"
        stroke={grey[600]}
      >
        {payload.name}
      </text>
      <text
        textAnchor={isFirst ? "start" : "end"}
        x={isFirst ? x + width + 10 : x - 6}
        y={y + height / 2 + 13}
        fontSize="12"
        stroke={grey[500]}
        strokeOpacity="0.5"
      >
        {payload.value}
      </text>
    </Layer>
  );
};

export default SankeyNode;
