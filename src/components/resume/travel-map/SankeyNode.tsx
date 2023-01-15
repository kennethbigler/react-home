import * as React from "react";
import { grey } from "@mui/material/colors/";
import { Rectangle, Layer } from "recharts";

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
  containerWidth: number;
}

const SankeyNode = ({
  x,
  y,
  width,
  height,
  index,
  payload,
  containerWidth,
}: SankeyNodeProps) => {
  const isOut = x + width + 6 > containerWidth;
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
        textAnchor={isOut ? "end" : "start"}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2}
        fontSize="14"
        stroke={grey[600]}
      >
        {payload.name}
      </text>
      <text
        textAnchor={isOut ? "end" : "start"}
        x={isOut ? x - 6 : x + width + 6}
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
